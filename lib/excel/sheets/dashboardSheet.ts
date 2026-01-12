import * as XLSX from 'xlsx';
import type { ExcelBuilderOptions, ExcelTranslations } from '../types';
import { DASHBOARD_REFS } from '../utils/cellReferences';
import { getCurrencyFormat, NUMBER_FORMATS } from '../utils/formatting';

/**
 * Build the Dashboard sheet with editable inputs and summary
 *
 * Row Layout:
 * 1: Title
 * 2: Section header - INPUTS
 * 3-13: Input values (editable - yellow cells)
 * 14: Empty row
 * 15: Section header - DERIVED VALUES
 * 16-21: Calculated values with formulas
 * 22: Empty row
 * 23: Section header - THREE PILLARS
 * 24-26: Three pillars summary
 * 27: Empty row
 * 28: Section header - TOTAL RESULTS
 * 29-33: Summary metrics
 * 34: Empty row
 * 35: Section header - VS STOCK MARKET
 * 36-39: Stock comparison
 */
export function buildDashboardSheet(
  options: ExcelBuilderOptions,
  t: ExcelTranslations
): XLSX.WorkSheet {
  const { inputs, language } = options;
  const currencyFmt = getCurrencyFormat(language, false);

  // Create the worksheet data as an array of arrays
  const data: (string | number | { f: string })[][] = [
    // Row 1: Title
    ['REAL ESTATE PRO - INVESTMENT ANALYSIS', '', ''],

    // Row 2: Section header - INPUTS
    [t.inputs, '', t.editableNote],

    // Row 3-13: Input values (editable - yellow cells)
    // All percentage inputs are stored as decimals for Excel (e.g., 4% = 0.04)
    [t.propertyValue, inputs.propertyValue, '(Market Value)'],                    // B3
    ['Below Market %', inputs.belowMarketPercent / 100, ''],                       // B4
    [t.downPaymentPercent, inputs.downPaymentPercent / 100, ''],                   // B5
    ['Closing Costs', inputs.closingCosts, ''],                                    // B6
    [t.monthlyRent, inputs.monthlyRent, ''],                                       // B7
    [t.appreciation, inputs.appreciation / 100, ''],                               // B8 - Convert 4 to 0.04
    [t.mortgageRate, inputs.mortgageRate / 100, ''],                               // B9 - Convert 6.5 to 0.065
    [t.mortgageTerm, inputs.mortgageTerm, ''],                                     // B10
    [t.rentGrowth, inputs.rentGrowth / 100, ''],                                   // B11 - Convert 3 to 0.03
    [t.operatingCosts, inputs.operatingCostsPercent / 100, ''],                    // B12 - Convert to decimal
    [t.stockReturnRate, 0.07, ''],                                                 // B13 - Default stock comparison rate

    // Row 14: Empty row
    ['', '', ''],

    // Row 15: Section header - DERIVED VALUES
    [t.derivedValues, '', ''],

    // Row 16-21: Calculated values with formulas
    // Purchase Price = Market Value × (1 - Below Market %)
    ['Purchase Price', { f: `${DASHBOARD_REFS.propertyValue}*(1-${DASHBOARD_REFS.belowMarketPercent})` }, ''],  // B16
    // Down Payment = Purchase Price × Down Payment %
    [t.downPaymentAmount, { f: `${DASHBOARD_REFS.purchasePrice}*${DASHBOARD_REFS.downPaymentPercent}` }, ''],    // B17
    // Loan Amount = Purchase Price - Down Payment
    [t.loanAmount, { f: `${DASHBOARD_REFS.purchasePrice}-${DASHBOARD_REFS.downPayment}` }, ''],                  // B18
    // Monthly Mortgage = PMT(rate/12, term*12, -loanAmount)
    [t.monthlyMortgage, { f: `PMT(${DASHBOARD_REFS.mortgageRate}/12,${DASHBOARD_REFS.mortgageTerm}*12,-${DASHBOARD_REFS.loanAmount})` }, ''],  // B19
    // Annual Operating Costs = Property Value × Operating Costs %
    [t.annualOperatingCosts, { f: `${DASHBOARD_REFS.propertyValue}*${DASHBOARD_REFS.operatingCostsPercent}` }, ''],  // B20
    // Total Cash Required = Down Payment + Closing Costs (THIS IS THE INITIAL INVESTMENT)
    ['Total Cash Required', { f: `${DASHBOARD_REFS.downPayment}+${DASHBOARD_REFS.closingCosts}` }, '(Initial Investment)'],  // B21

    // Row 22: Empty row
    ['', '', ''],

    // Row 23: Section header - THREE PILLARS
    [t.threePillars, '', `(${t.years}: ${inputs.mortgageTerm})`],

    // Row 24-26: Three pillars summary (references to yearly summary sheet)
    [t.cashFlow, { f: `'${t.sheetYearlySummary}'!D${inputs.mortgageTerm + 2}` }, t.accumulated],
    [t.equityBuilt, { f: `${DASHBOARD_REFS.loanAmount}` }, t.loanPaidOff],
    [t.appreciationGains, { f: `'${t.sheetYearlySummary}'!E${inputs.mortgageTerm + 2}` }, t.propertyGrowth],

    // Row 27: Empty row
    ['', '', ''],

    // Row 28: Section header - TOTAL RESULTS
    [t.totalResults, '', ''],

    // Row 29-33: Summary metrics
    // Total Wealth = Net Worth from yearly summary
    [t.totalWealthBuilt, { f: `'${t.sheetYearlySummary}'!G${inputs.mortgageTerm + 2}` }, ''],  // B29
    // Your Investment = Total Cash Required (down payment + closing costs)
    [t.yourInvestment, { f: DASHBOARD_REFS.totalCashRequired }, ''],                           // B30
    // Total ROI = (Net Worth / Initial Investment)
    [t.totalROI, { f: `(B29/B30)` }, ''],                                                       // B31
    // Annualized ROI (CAGR) = ((Final/Initial)^(1/years)) - 1
    [t.annualizedROI, { f: `POWER(B29/B30,1/${DASHBOARD_REFS.mortgageTerm})-1` }, ''],         // B32
    // Leverage Effect = (Property appreciation / Initial investment)
    [t.leverageEffect, { f: `(${DASHBOARD_REFS.propertyValue}*${DASHBOARD_REFS.appreciation})/${DASHBOARD_REFS.totalCashRequired}` }, ''],  // B33

    // Row 34: Empty row
    ['', '', ''],

    // Row 35: Section header - VS STOCK MARKET
    [t.vsStockMarket, '', ''],

    // Row 36-39: Stock comparison - ALL START WITH SAME INITIAL INVESTMENT (totalCashRequired)
    [t.stockAt7, { f: `${DASHBOARD_REFS.totalCashRequired}*POWER(1.07,${DASHBOARD_REFS.mortgageTerm})` }, ''],   // B36
    [t.stockAt10, { f: `${DASHBOARD_REFS.totalCashRequired}*POWER(1.10,${DASHBOARD_REFS.mortgageTerm})` }, ''],  // B37
    [t.realEstateWealth, { f: 'B29' }, ''],                                                                       // B38
    [t.winner, { f: 'IF(B38>B36,IF(B38>B37,"Real Estate","Stocks @10%"),IF(B36>B37,"Stocks @7%","Stocks @10%"))' }, ''],  // B39
  ];

  // Create worksheet from data
  const ws = XLSX.utils.aoa_to_sheet(data);

  // Set column widths
  ws['!cols'] = [
    { wch: 28 }, // Column A - Labels
    { wch: 18 }, // Column B - Values
    { wch: 30 }, // Column C - Notes
  ];

  // Apply number formats to specific cells
  // Input cells - currency
  if (ws['B3']) ws['B3'].z = currencyFmt;   // Property Value
  if (ws['B6']) ws['B6'].z = currencyFmt;   // Closing Costs
  if (ws['B7']) ws['B7'].z = currencyFmt;   // Monthly Rent

  // Input cells - percentages (already stored as decimals like 0.04)
  if (ws['B4']) ws['B4'].z = NUMBER_FORMATS.PERCENT_ONE_DECIMAL;   // Below Market %
  if (ws['B5']) ws['B5'].z = NUMBER_FORMATS.PERCENT_ONE_DECIMAL;   // Down Payment %
  if (ws['B8']) ws['B8'].z = NUMBER_FORMATS.PERCENT_ONE_DECIMAL;   // Appreciation
  if (ws['B9']) ws['B9'].z = NUMBER_FORMATS.PERCENT_ONE_DECIMAL;   // Mortgage Rate
  if (ws['B11']) ws['B11'].z = NUMBER_FORMATS.PERCENT_ONE_DECIMAL; // Rent Growth
  if (ws['B12']) ws['B12'].z = NUMBER_FORMATS.PERCENT_ONE_DECIMAL; // Operating Costs
  if (ws['B13']) ws['B13'].z = NUMBER_FORMATS.PERCENT_ONE_DECIMAL; // Stock Return Rate

  // Derived cells - currency
  if (ws['B16']) ws['B16'].z = currencyFmt;  // Purchase Price
  if (ws['B17']) ws['B17'].z = currencyFmt;  // Down Payment
  if (ws['B18']) ws['B18'].z = currencyFmt;  // Loan Amount
  if (ws['B19']) ws['B19'].z = currencyFmt;  // Monthly Mortgage
  if (ws['B20']) ws['B20'].z = currencyFmt;  // Annual Operating Costs
  if (ws['B21']) ws['B21'].z = currencyFmt;  // Total Cash Required

  // Three pillars - currency
  if (ws['B24']) ws['B24'].z = currencyFmt;  // Cash Flow
  if (ws['B25']) ws['B25'].z = currencyFmt;  // Equity Built
  if (ws['B26']) ws['B26'].z = currencyFmt;  // Appreciation Gains

  // Summary cells
  if (ws['B29']) ws['B29'].z = currencyFmt;                        // Total Wealth
  if (ws['B30']) ws['B30'].z = currencyFmt;                        // Your Investment
  if (ws['B31']) ws['B31'].z = NUMBER_FORMATS.PERCENT_ONE_DECIMAL; // Total ROI
  if (ws['B32']) ws['B32'].z = NUMBER_FORMATS.PERCENT_ONE_DECIMAL; // Annualized ROI
  if (ws['B33']) ws['B33'].z = NUMBER_FORMATS.PERCENT_ONE_DECIMAL; // Leverage Effect

  // Stock comparison cells
  if (ws['B36']) ws['B36'].z = currencyFmt;  // Stock @7%
  if (ws['B37']) ws['B37'].z = currencyFmt;  // Stock @10%
  if (ws['B38']) ws['B38'].z = currencyFmt;  // Real Estate Wealth

  return ws;
}
