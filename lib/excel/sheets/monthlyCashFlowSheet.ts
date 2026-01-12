import * as XLSX from 'xlsx';
import type { ExcelBuilderOptions, ExcelTranslations } from '../types';
import { DASHBOARD_REFS } from '../utils/cellReferences';
import { getCurrencyFormat } from '../utils/formatting';

/**
 * Build the Monthly Cash Flow sheet with 360 rows
 */
export function buildMonthlyCashFlowSheet(
  options: ExcelBuilderOptions,
  t: ExcelTranslations
): XLSX.WorkSheet {
  const { inputs, language } = options;
  const currencyFmt = getCurrencyFormat(language);
  const totalMonths = inputs.mortgageTerm * 12;
  const dashboardSheet = t.sheetDashboard;

  // Create header row
  const data: (string | number | { f: string })[][] = [
    [
      t.month,
      t.year,
      t.rentIncome,
      t.operatingCostsLabel,
      t.mortgagePayment,
      t.netCashFlow,
      t.cumulativeCashFlow,
    ],
  ];

  // Generate formula-based rows for each month
  for (let month = 1; month <= totalMonths; month++) {
    const row = month + 1;
    const prevRow = row - 1;
    const yearNum = Math.ceil(month / 12);

    // Dashboard references
    const rentRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.monthlyRent}`;
    const rentGrowthRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.rentGrowth}`;
    const opsRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.annualOperatingCosts}`;
    const mortgageRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.monthlyMortgage}`;
    const termRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.mortgageTerm}`;

    // Rent grows annually (applied at year boundaries) - rate is already decimal
    const rentFormula = month === 1
      ? rentRef
      : `C${prevRow}*IF(MOD(A${row},12)=1,1+${rentGrowthRef},1)`;

    // Operating costs grow with rent - rate is already decimal
    const opsFormula = month === 1
      ? `${opsRef}/12`
      : `D${prevRow}*IF(MOD(A${row},12)=1,1+${rentGrowthRef},1)`;

    // Mortgage is 0 after term ends
    const mortgageFormula = `IF(B${row}<=${termRef},${mortgageRef},0)`;

    // Net cash flow
    const cashFlowFormula = `C${row}-D${row}-E${row}`;

    // Cumulative cash flow
    const cumulativeFormula = month === 1
      ? `F${row}`
      : `G${prevRow}+F${row}`;

    data.push([
      month,
      yearNum,
      { f: rentFormula },
      { f: opsFormula },
      { f: mortgageFormula },
      { f: cashFlowFormula },
      { f: cumulativeFormula },
    ]);
  }

  // Add summary row
  const totalRow = totalMonths + 2;
  data.push([
    t.totals,
    '',
    { f: `SUM(C2:C${totalRow - 1})` },
    { f: `SUM(D2:D${totalRow - 1})` },
    { f: `SUM(E2:E${totalRow - 1})` },
    { f: `SUM(F2:F${totalRow - 1})` },
    { f: `G${totalRow - 1}` },
  ]);

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  ws['!cols'] = [
    { wch: 8 },  // Month
    { wch: 6 },  // Year
    { wch: 14 }, // Rent
    { wch: 16 }, // Operating Costs
    { wch: 14 }, // Mortgage
    { wch: 14 }, // Net Cash Flow
    { wch: 18 }, // Cumulative
  ];

  // Apply number formats
  for (let row = 2; row <= totalRow; row++) {
    const currencyCols = ['C', 'D', 'E', 'F', 'G'];
    currencyCols.forEach(col => {
      const cellRef = `${col}${row}`;
      if (ws[cellRef]) {
        ws[cellRef].z = currencyFmt;
      }
    });
  }

  return ws;
}
