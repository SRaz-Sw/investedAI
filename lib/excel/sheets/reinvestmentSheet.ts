import * as XLSX from 'xlsx';
import type { ExcelBuilderOptions, ExcelTranslations } from '../types';
import { DASHBOARD_REFS } from '../utils/cellReferences';
import { getCurrencyFormat } from '../utils/formatting';

/**
 * Build the Reinvestment Scenario sheet
 * Shows what happens when positive cash flow is applied to extra principal payments
 */
export function buildReinvestmentSheet(
  options: ExcelBuilderOptions,
  t: ExcelTranslations
): XLSX.WorkSheet {
  const { inputs, language } = options;
  const currencyFmt = getCurrencyFormat(language);
  const totalMonths = inputs.mortgageTerm * 12;
  const dashboardSheet = t.sheetDashboard;
  const cashFlowSheet = t.sheetMonthlyCashFlow;
  const amortSheet = t.sheetAmortization;

  // Create header row
  const data: (string | number | { f: string })[][] = [
    [
      t.month,
      t.year,
      t.standardPayoff,
      t.netCashFlow,
      t.extraPayment,
      t.reinvestBalance,
      t.interestSaved,
    ],
  ];

  // Dashboard references
  const loanRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.loanAmount}`;
  const rateRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.mortgageRate}`;
  const paymentRef = `'${dashboardSheet}'!$${DASHBOARD_REFS.monthlyMortgage}`;

  // Generate rows
  for (let month = 1; month <= totalMonths; month++) {
    const row = month + 1;
    const prevRow = row - 1;
    const yearNum = Math.ceil(month / 12);

    // Standard balance from amortization sheet
    const standardBalanceFormula = `'${amortSheet}'!F${row}`;

    // Net cash flow from cash flow sheet
    const cashFlowFormula = `'${cashFlowSheet}'!F${row}`;

    // Extra payment = max(0, net cash flow)
    // Only apply extra payment if reinvest balance > 0
    const extraPaymentFormula = month === 1
      ? `MAX(0,D${row})`
      : `IF(F${prevRow}>0,MAX(0,D${row}),0)`;

    // Reinvest balance calculation - rate is already decimal
    let reinvestBalanceFormula: string;
    if (month === 1) {
      // First month
      const interestPart = `${loanRef}*${rateRef}/12`;
      const principalPart = `${paymentRef}-${interestPart}`;
      reinvestBalanceFormula = `MAX(0,${loanRef}-${principalPart}-E${row})`;
    } else {
      // Subsequent months - only calculate if previous balance > 0
      const interestPart = `F${prevRow}*${rateRef}/12`;
      const principalPart = `${paymentRef}-${interestPart}`;
      reinvestBalanceFormula = `IF(F${prevRow}<=0,0,MAX(0,F${prevRow}-${principalPart}-E${row}))`;
    }

    // Interest saved = difference in interest between standard and reinvest - rate is already decimal
    // Cumulative savings
    const interestSavedFormula = month === 1
      ? `MAX(0,(C${row}-F${row})*${rateRef}/12)`
      : `G${prevRow}+MAX(0,(C${row}-F${row})*${rateRef}/12)`;

    data.push([
      month,
      yearNum,
      { f: standardBalanceFormula },
      { f: cashFlowFormula },
      { f: extraPaymentFormula },
      { f: reinvestBalanceFormula },
      { f: interestSavedFormula },
    ]);
  }

  // Add summary section
  const summaryStartRow = totalMonths + 3;
  data.push(['', '', '', '', '', '', '']);
  data.push([
    'SUMMARY',
    '',
    '',
    '',
    '',
    '',
    '',
  ]);

  // Calculate months saved (find first month where reinvest balance = 0)
  data.push([
    t.monthsSaved,
    { f: `${totalMonths}-COUNTIF(F2:F${totalMonths + 1},">0")` },
    '',
    '',
    '',
    '',
    '',
  ]);

  // Total interest saved
  data.push([
    t.interestSaved,
    { f: `G${totalMonths + 1}` },
    '',
    '',
    '',
    '',
    '',
  ]);

  // Total extra payments made
  data.push([
    'Total Extra Payments',
    { f: `SUM(E2:E${totalMonths + 1})` },
    '',
    '',
    '',
    '',
    '',
  ]);

  // Create worksheet
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  ws['!cols'] = [
    { wch: 8 },  // Month
    { wch: 6 },  // Year
    { wch: 16 }, // Standard Balance
    { wch: 14 }, // Cash Flow
    { wch: 14 }, // Extra Payment
    { wch: 16 }, // Reinvest Balance
    { wch: 16 }, // Interest Saved
  ];

  // Apply number formats
  for (let row = 2; row <= totalMonths + 7; row++) {
    ['C', 'D', 'E', 'F', 'G'].forEach(col => {
      const cellRef = `${col}${row}`;
      if (ws[cellRef]) {
        ws[cellRef].z = currencyFmt;
      }
    });
  }

  // Summary row formats
  if (ws[`B${summaryStartRow + 2}`]) ws[`B${summaryStartRow + 2}`].z = '#,##0';
  if (ws[`B${summaryStartRow + 3}`]) ws[`B${summaryStartRow + 3}`].z = currencyFmt;
  if (ws[`B${summaryStartRow + 4}`]) ws[`B${summaryStartRow + 4}`].z = currencyFmt;

  return ws;
}
