/**
 * Convert column index to Excel letter (0 = A, 1 = B, 26 = AA, etc.)
 */
export function colToLetter(col: number): string {
  let letter = '';
  let temp = col;

  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }

  return letter;
}

/**
 * Convert row and column to cell reference (0-indexed)
 * cellRef(0, 0) => 'A1'
 * cellRef(1, 1) => 'B2'
 */
export function cellRef(row: number, col: number): string {
  return `${colToLetter(col)}${row + 1}`;
}

/**
 * Create a formula reference to another sheet
 * sheetRef('Dashboard', 'B2') => 'Dashboard!$B$2'
 */
export function sheetRef(sheetName: string, cell: string): string {
  // Make the reference absolute by adding $ signs
  const absoluteCell = cell.replace(/([A-Z]+)(\d+)/, '$$$1$$$2');
  return `'${sheetName}'!${absoluteCell}`;
}

/**
 * Generate a range reference (0-indexed)
 * rangeRef(0, 0, 10, 2) => 'A1:C11'
 */
export function rangeRef(
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): string {
  return `${cellRef(startRow, startCol)}:${cellRef(endRow, endCol)}`;
}

/**
 * Standard cell references for Dashboard inputs
 * These are the cells users can edit to recalculate the entire workbook
 */
export const DASHBOARD_REFS = {
  // Input cells (B column, rows 3-14)
  propertyValue: 'B3',        // Market value
  belowMarketPercent: 'B4',   // % below market
  downPaymentPercent: 'B5',   // Down payment %
  closingCosts: 'B6',         // One-time closing costs
  monthlyRent: 'B7',
  appreciation: 'B8',
  mortgageRate: 'B9',
  mortgageTerm: 'B10',
  rentGrowth: 'B11',
  operatingCostsPercent: 'B12',
  stockReturnRate: 'B13',

  // Derived cells (B column, rows 16-21)
  purchasePrice: 'B16',       // Actual purchase price (market * (1 - belowMarket%))
  downPayment: 'B17',
  loanAmount: 'B18',
  monthlyMortgage: 'B19',
  annualOperatingCosts: 'B20',
  totalCashRequired: 'B21',   // Down payment + closing costs
} as const;

/**
 * Get absolute reference for Dashboard cell
 */
export function dashboardRef(key: keyof typeof DASHBOARD_REFS): string {
  return sheetRef('Dashboard', DASHBOARD_REFS[key]);
}
