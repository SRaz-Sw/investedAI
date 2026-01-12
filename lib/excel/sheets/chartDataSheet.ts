import * as XLSX from 'xlsx';
import type { ExcelBuilderOptions, ExcelTranslations } from '../types';
import { DASHBOARD_REFS } from '../utils/cellReferences';
import { getCurrencyFormat } from '../utils/formatting';

/**
 * Build the Chart Data sheet
 * Pre-formatted data that can be used to create Excel charts
 *
 * IMPORTANT: Stock comparison uses totalCashRequired as the initial investment
 * to ensure fair comparison with real estate.
 */
export function buildChartDataSheet(
  options: ExcelBuilderOptions,
  t: ExcelTranslations
): XLSX.WorkSheet {
  const { inputs, language } = options;
  const currencyFmt = getCurrencyFormat(language, false);
  const years = inputs.mortgageTerm;
  const dashboardSheet = t.sheetDashboard;
  const yearlySummarySheet = t.sheetYearlySummary;

  const data: (string | number | { f: string })[][] = [];

  // Section 1: Wealth Accumulation (for stacked area chart)
  data.push(['WEALTH ACCUMULATION OVER TIME', '', '', '', '']);
  data.push([t.year, t.cashFlow, t.equity, t.appreciationGains, t.totalWealth]);

  const initialInvestmentRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.totalCashRequired}`;
  const loanRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.loanAmount}`;
  const propRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.propertyValue}`;

  for (let year = 0; year <= years; year++) {
    const yearlyRow = year + 2;

    if (year === 0) {
      data.push([
        year,
        0,
        0,
        0,
        0,
      ]);
    } else {
      // Reference yearly summary for consistent data
      data.push([
        year,
        { f: `'${yearlySummarySheet}'!D${yearlyRow}` },
        { f: `'${yearlySummarySheet}'!C${yearlyRow}-${initialInvestmentRef}` },
        { f: `'${yearlySummarySheet}'!E${yearlyRow}` },
        { f: `'${yearlySummarySheet}'!F${yearlyRow}` },
      ]);
    }
  }

  // Empty rows between sections
  data.push(['', '', '', '', '']);
  data.push(['', '', '', '', '']);

  // Section 2: Rent vs Mortgage (for crossover line chart)
  data.push(['RENT VS MORTGAGE CROSSOVER', '', '', '', '']);
  data.push([t.year, t.rentIncome, t.mortgagePayment, t.netCashFlow, '']);

  const rentRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.monthlyRent}`;
  const mortgageRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.monthlyMortgage}`;
  const opsRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.annualOperatingCosts}`;
  const rentGrowthRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.rentGrowth}`;
  const termRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.mortgageTerm}`;

  for (let year = 0; year <= years; year++) {
    // Annual rent (with growth) - rate is already decimal
    const rentFormula = year === 0
      ? `${rentRef}*12`
      : `${rentRef}*12*POWER(1+${rentGrowthRef},${year})`;

    // Annual mortgage + operating costs - rate is already decimal
    const mortgageFormula = year === 0 || year >= inputs.mortgageTerm
      ? (year === 0 ? `${mortgageRef}*12+${opsRef}` : `${opsRef}*POWER(1+${rentGrowthRef},${year})`)
      : `${mortgageRef}*12+${opsRef}*POWER(1+${rentGrowthRef},${year})`;

    const adjustedMortgage = year >= inputs.mortgageTerm
      ? `${opsRef}*POWER(1+${rentGrowthRef},${year})`
      : mortgageFormula;

    data.push([
      year,
      { f: rentFormula },
      { f: adjustedMortgage },
      { f: `B${data.length + 1}-C${data.length + 1}` },
      '',
    ]);
  }

  // Empty rows between sections
  data.push(['', '', '', '', '']);
  data.push(['', '', '', '', '']);

  // Section 3: Stock Comparison Data
  // IMPORTANT: All start with totalCashRequired (initial investment)
  data.push(['INVESTMENT COMPARISON', '', '', '', '']);
  data.push([t.year, t.realEstate, t.stock7, t.stock10, '']);

  for (let year = 0; year <= years; year++) {
    if (year === 0) {
      // All start with the same initial investment
      data.push([
        year,
        { f: initialInvestmentRef },
        { f: initialInvestmentRef },
        { f: initialInvestmentRef },
        '',
      ]);
    } else {
      const prevDataRow = data.length; // Previous row in this section
      data.push([
        year,
        { f: `'${yearlySummarySheet}'!G${year + 2}` }, // Net Worth from yearly summary
        { f: `C${prevDataRow}*1.07` },
        { f: `D${prevDataRow}*1.10` },
        '',
      ]);
    }
  }

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  ws['!cols'] = [
    { wch: 10 }, // Year/Label
    { wch: 16 }, // Value 1
    { wch: 16 }, // Value 2
    { wch: 16 }, // Value 3
    { wch: 16 }, // Value 4
  ];

  // Apply currency formats to data cells
  // This is simplified - in practice you'd iterate through specific ranges
  const totalRows = data.length;
  for (let row = 1; row <= totalRows; row++) {
    ['B', 'C', 'D', 'E'].forEach(col => {
      const cellRef = `${col}${row}`;
      if (ws[cellRef] && (ws[cellRef].f || typeof ws[cellRef].v === 'number')) {
        ws[cellRef].z = currencyFmt;
      }
    });
  }

  return ws;
}
