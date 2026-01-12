import * as XLSX from 'xlsx';
import type { ExcelBuilderOptions, ExcelTranslations } from '../types';
import { DASHBOARD_REFS } from '../utils/cellReferences';
import { getCurrencyFormat, NUMBER_FORMATS } from '../utils/formatting';

/**
 * Build the Yearly Summary sheet with annual breakdown
 *
 * Uses totalCashRequired as the initial investment for ROI calculations
 * to properly account for down payment + closing costs.
 */
export function buildYearlySummarySheet(
  options: ExcelBuilderOptions,
  t: ExcelTranslations
): XLSX.WorkSheet {
  const { inputs, language } = options;
  const currencyFmt = getCurrencyFormat(language, false);
  const years = inputs.mortgageTerm;
  const dashboardSheet = t.sheetDashboard;
  const cashFlowSheet = t.sheetMonthlyCashFlow;
  const amortSheet = t.sheetAmortization;

  // Create header row
  const data: (string | number | { f: string })[][] = [
    [
      t.year,
      t.propertyValueLabel,
      t.equity,
      t.cashFlow,
      t.appreciationGains,
      t.totalWealth,
      'Net Worth',
      t.roi,
    ],
  ];

  // Dashboard references
  const propRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.propertyValue}`;
  const appRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.appreciation}`;
  const downRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.downPayment}`;
  const loanRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.loanAmount}`;
  const initialInvestmentRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.totalCashRequired}`;

  // Year 0 - starting point
  data.push([
    0,
    { f: propRef },
    { f: downRef },
    0,
    0,
    { f: downRef },
    { f: initialInvestmentRef }, // Net worth = initial investment at start
    0,
  ]);

  // Generate yearly data
  for (let year = 1; year <= years; year++) {
    const row = year + 2;
    const prevRow = row - 1;
    const monthEnd = year * 12 + 1; // Row in monthly sheet for year-end

    // Property value grows with appreciation - rate is already decimal
    const propValueFormula = `B${prevRow}*(1+${appRef})`;

    // Equity = Down payment + principal paid (from amortization)
    // Using loan amount minus remaining balance approach
    const simpleEquityFormula = `${downRef}+(${loanRef}-'${amortSheet}'!F${monthEnd})`;

    // Cash flow from monthly sheet - cumulative at year end
    const cashFlowFormula = `'${cashFlowSheet}'!G${monthEnd}`;

    // Appreciation = current property value - original
    const appreciationFormula = `B${row}-${propRef}`;

    // Total wealth = equity + cash flow + appreciation - down payment (net gain)
    const totalWealthFormula = `C${row}+D${row}+E${row}-${downRef}`;

    // Net Worth = Property Value - Remaining Loan + Cash Flow
    // = Equity + Cash Flow
    const netWorthFormula = `C${row}+D${row}`;

    // ROI = (net worth / initial investment)
    const roiFormula = `(G${row}/${initialInvestmentRef})`;

    data.push([
      year,
      { f: propValueFormula },
      { f: simpleEquityFormula },
      { f: cashFlowFormula },
      { f: appreciationFormula },
      { f: totalWealthFormula },
      { f: netWorthFormula },
      { f: roiFormula },
    ]);
  }

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  ws['!cols'] = [
    { wch: 6 },  // Year
    { wch: 16 }, // Property Value
    { wch: 14 }, // Equity
    { wch: 14 }, // Cash Flow
    { wch: 16 }, // Appreciation
    { wch: 16 }, // Total Wealth
    { wch: 16 }, // Net Worth
    { wch: 10 }, // ROI
  ];

  // Apply number formats
  for (let row = 2; row <= years + 2; row++) {
    // Currency columns - B through G
    ['B', 'C', 'D', 'E', 'F', 'G'].forEach(col => {
      const cellRef = `${col}${row}`;
      if (ws[cellRef]) {
        ws[cellRef].z = currencyFmt;
      }
    });

    // ROI percentage (column H)
    if (ws[`H${row}`]) {
      ws[`H${row}`].z = NUMBER_FORMATS.PERCENT_ONE_DECIMAL;
    }
  }

  return ws;
}
