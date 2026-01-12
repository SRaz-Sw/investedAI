import * as XLSX from 'xlsx';
import type { ExcelBuilderOptions, ExcelTranslations } from '../types';
import { DASHBOARD_REFS } from '../utils/cellReferences';
import { getCurrencyFormat, NUMBER_FORMATS } from '../utils/formatting';

/**
 * Build the Stock Comparison sheet
 * Compares Real Estate compound ROI vs Stock Market compound ROI
 *
 * IMPORTANT: All investments start with the SAME initial investment (totalCashRequired)
 * This is the down payment + closing costs, which is the actual cash outlay.
 */
export function buildStockComparisonSheet(
  options: ExcelBuilderOptions,
  t: ExcelTranslations
): XLSX.WorkSheet {
  const { inputs, language } = options;
  const currencyFmt = getCurrencyFormat(language, false);
  const years = inputs.mortgageTerm;
  const dashboardSheet = t.sheetDashboard;
  const yearlySummarySheet = t.sheetYearlySummary;

  // Create header row
  const data: (string | number | { f: string })[][] = [
    [
      t.year,
      'RE Value',
      'RE ROI %',
      t.stock7,
      'Stock 7% ROI',
      t.stock10,
      'Stock 10% ROI',
      t.winner,
    ],
  ];

  // Dashboard reference for total cash required (initial investment)
  // This is the fair comparison point: down payment + closing costs
  const initialInvestmentRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.totalCashRequired}`;

  // Year 0 - starting point (all equal to initial investment)
  data.push([
    0,
    { f: initialInvestmentRef },
    0,
    { f: initialInvestmentRef },
    0,
    { f: initialInvestmentRef },
    0,
    'All Equal',
  ]);

  // Generate yearly comparison
  for (let year = 1; year <= years; year++) {
    const row = year + 2;

    // Real estate Net Worth from yearly summary (column G = Net Worth)
    const reWealthFormula = `'${yearlySummarySheet}'!G${row}`;

    // Real Estate ROI = (Net Worth / Initial Investment)
    const reROIFormula = `B${row}/${initialInvestmentRef}`;

    // Stock at 7% - compound growth from initial investment
    const stock7Formula = `${initialInvestmentRef}*POWER(1.07,${year})`;

    // Stock 7% ROI = (Stock Value / Initial Investment)
    const stock7ROIFormula = `D${row}/${initialInvestmentRef}`;

    // Stock at 10% - compound growth from initial investment
    const stock10Formula = `${initialInvestmentRef}*POWER(1.10,${year})`;

    // Stock 10% ROI = (Stock Value / Initial Investment)
    const stock10ROIFormula = `F${row}/${initialInvestmentRef}`;

    // Winner determination based on highest ROI
    const winnerFormula = `IF(C${row}>=E${row},IF(C${row}>=G${row},"Real Estate",IF(G${row}>E${row},"Stock 10%","Stock 7%")),IF(E${row}>G${row},"Stock 7%","Stock 10%"))`;

    data.push([
      year,
      { f: reWealthFormula },
      { f: reROIFormula },
      { f: stock7Formula },
      { f: stock7ROIFormula },
      { f: stock10Formula },
      { f: stock10ROIFormula },
      { f: winnerFormula },
    ]);
  }

  // Add summary insights row
  data.push(['', '', '', '', '', '', '', '']);
  data.push([
    `SUMMARY (${years} years)`,
    '',
    '',
    '',
    '',
    '',
    '',
    '',
  ]);

  const finalRow = years + 2;

  // Compound Annual Growth Rate (CAGR) formulas
  data.push([
    'Initial Investment',
    { f: initialInvestmentRef },
    '',
    { f: initialInvestmentRef },
    '',
    { f: initialInvestmentRef },
    '',
    '',
  ]);

  data.push([
    'Final Value',
    { f: `B${finalRow}` },
    '',
    { f: `D${finalRow}` },
    '',
    { f: `F${finalRow}` },
    '',
    '',
  ]);

  data.push([
    'Total Return %',
    '',
    { f: `C${finalRow}` },
    '',
    { f: `E${finalRow}` },
    '',
    { f: `G${finalRow}` },
    '',
  ]);

  data.push([
    'CAGR (Annual %)',
    '',
    { f: `POWER(C${finalRow},1/${years})-1` },
    '',
    { f: `POWER(E${finalRow},1/${years})-1` },
    '',
    { f: `POWER(G${finalRow},1/${years})-1` },
    '',
  ]);

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  ws['!cols'] = [
    { wch: 18 }, // Year / Label
    { wch: 16 }, // Real Estate Value
    { wch: 12 }, // RE ROI %
    { wch: 16 }, // Stock 7%
    { wch: 12 }, // Stock 7% ROI
    { wch: 16 }, // Stock 10%
    { wch: 12 }, // Stock 10% ROI
    { wch: 14 }, // Winner
  ];

  // Apply number formats
  for (let row = 2; row <= years + 8; row++) {
    // Currency columns - B, D, F
    ['B', 'D', 'F'].forEach(col => {
      const cellRef = `${col}${row}`;
      if (ws[cellRef]) {
        ws[cellRef].z = currencyFmt;
      }
    });

    // Percentage columns - C, E, G (ROI columns)
    ['C', 'E', 'G'].forEach(col => {
      const cellRef = `${col}${row}`;
      if (ws[cellRef]) {
        ws[cellRef].z = NUMBER_FORMATS.PERCENT_ONE_DECIMAL;
      }
    });
  }

  return ws;
}
