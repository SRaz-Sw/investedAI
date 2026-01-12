import * as XLSX from 'xlsx';
import type { ExcelBuilderOptions, ExcelTranslations } from '../types';
import { dashboardRef, DASHBOARD_REFS } from '../utils/cellReferences';
import { getCurrencyFormat, NUMBER_FORMATS } from '../utils/formatting';

/**
 * Build the Amortization sheet with 360 monthly rows
 */
export function buildAmortizationSheet(
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
      t.payment,
      t.principal,
      t.interest,
      t.balance,
      t.equityPercent,
      t.cumulativeInterest,
    ],
  ];

  // Generate formula-based rows for each month
  for (let month = 1; month <= totalMonths; month++) {
    const row = month + 1; // Excel row (1-indexed, header is row 1)
    const prevRow = row - 1;

    // References to Dashboard cells
    const loanRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.loanAmount}`;
    const rateRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.mortgageRate}`;
    const paymentRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.monthlyMortgage}`;

    let balanceFormula: string;
    let interestFormula: string;

    if (month === 1) {
      // First month: balance starts from loan amount
      balanceFormula = `MAX(0,${loanRef}-D${row})`;
      interestFormula = `${loanRef}*${rateRef}/12`; // Rate is already decimal
    } else {
      // Subsequent months: use previous row's balance
      balanceFormula = `MAX(0,F${prevRow}-D${row})`;
      interestFormula = `F${prevRow}*${rateRef}/12`; // Rate is already decimal
    }

    const monthData: (string | number | { f: string })[] = [
      month, // Month number
      { f: `CEILING(A${row}/12,1)` }, // Year
      { f: paymentRef }, // Payment
      { f: `C${row}-E${row}` }, // Principal = Payment - Interest
      { f: interestFormula }, // Interest
      { f: balanceFormula }, // Balance
      { f: `(${loanRef}-F${row})/${loanRef}` }, // Equity %
      month === 1
        ? { f: `E${row}` } // First month cumulative interest
        : { f: `H${prevRow}+E${row}` }, // Cumulative interest
    ];

    data.push(monthData);
  }

  // Add totals row
  const totalRow = totalMonths + 2;
  data.push([
    t.totals,
    '',
    { f: `SUM(C2:C${totalRow - 1})` }, // Total payments
    { f: `SUM(D2:D${totalRow - 1})` }, // Total principal
    { f: `SUM(E2:E${totalRow - 1})` }, // Total interest
    '', // No balance total
    '', // No equity total
    { f: `H${totalRow - 1}` }, // Final cumulative interest
  ]);

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  ws['!cols'] = [
    { wch: 8 },  // Month
    { wch: 6 },  // Year
    { wch: 14 }, // Payment
    { wch: 14 }, // Principal
    { wch: 14 }, // Interest
    { wch: 16 }, // Balance
    { wch: 10 }, // Equity %
    { wch: 18 }, // Cumulative Interest
  ];

  // Apply number formats
  for (let row = 2; row <= totalRow; row++) {
    const cells = ['C', 'D', 'E', 'F', 'H'];
    cells.forEach(col => {
      const cellRef = `${col}${row}`;
      if (ws[cellRef]) {
        ws[cellRef].z = currencyFmt;
      }
    });

    // Equity percentage format
    if (ws[`G${row}`]) {
      ws[`G${row}`].z = NUMBER_FORMATS.PERCENT_ONE_DECIMAL;
    }
  }

  return ws;
}
