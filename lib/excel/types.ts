import type { Language } from '@/lib/translations';

// Input data structure for Excel export (Real Estate Pro)
export interface ExcelExportInputs {
  propertyValue: number;          // Market value of property
  belowMarketPercent: number;     // % below market value purchased at (0-50)
  downPaymentPercent: number;     // Down payment as % of purchase price
  closingCosts: number;           // One-time closing costs
  monthlyRent: number;
  appreciation: number;           // Annual appreciation rate (e.g., 4 for 4%)
  mortgageRate: number;           // Annual mortgage rate (e.g., 6.5 for 6.5%)
  mortgageTerm: number;           // Mortgage term in years
  rentGrowth: number;             // Annual rent growth rate (e.g., 3 for 3%)
  operatingCostsPercent: number;  // Annual operating costs as % of property value
}

// Cell reference locations for the Dashboard sheet (row numbers, 1-indexed)
export interface InputCellRefs {
  propertyValue: string;
  belowMarketPercent: string;
  downPaymentPercent: string;
  closingCosts: string;
  monthlyRent: string;
  appreciation: string;
  mortgageRate: string;
  mortgageTerm: string;
  rentGrowth: string;
  operatingCostsPercent: string;
}

// Computed cell references (derived from inputs)
export interface DerivedCellRefs {
  purchasePrice: string;      // Actual purchase price (market value * (1 - belowMarket%))
  downPayment: string;
  loanAmount: string;
  monthlyMortgage: string;
  annualOperatingCosts: string;
  totalCashRequired: string;  // Down payment + closing costs (initial investment)
}

// Excel builder options
export interface ExcelBuilderOptions {
  language: Language;
  inputs: ExcelExportInputs;
  currencySymbol: string;
}

// Translation keys for Excel export
export interface ExcelTranslations {
  // Button states
  exportToExcel: string;
  downloading: string;
  downloadComplete: string;

  // Sheet names
  sheetDashboard: string;
  sheetAmortization: string;
  sheetMonthlyCashFlow: string;
  sheetYearlySummary: string;
  sheetStockComparison: string;
  sheetReinvestment: string;
  sheetChartData: string;

  // Dashboard labels
  inputs: string;
  editableNote: string;
  propertyValue: string;
  downPaymentPercent: string;
  downPaymentAmount: string;
  monthlyRent: string;
  appreciation: string;
  mortgageRate: string;
  mortgageTerm: string;
  rentGrowth: string;
  operatingCosts: string;
  stockReturnRate: string;

  derivedValues: string;
  loanAmount: string;
  monthlyMortgage: string;
  annualOperatingCosts: string;

  threePillars: string;
  cashFlow: string;
  equityBuilt: string;
  appreciationGains: string;
  accumulated: string;
  loanPaidOff: string;
  propertyGrowth: string;

  totalResults: string;
  totalWealthBuilt: string;
  yourInvestment: string;
  totalROI: string;
  annualizedROI: string;
  leverageEffect: string;

  vsStockMarket: string;
  stockAt7: string;
  stockAt10: string;
  realEstateWealth: string;
  winner: string;
  years: string;

  // Amortization labels
  month: string;
  payment: string;
  principal: string;
  interest: string;
  balance: string;
  equityPercent: string;
  cumulativeInterest: string;
  totals: string;

  // Cash flow labels
  year: string;
  rentIncome: string;
  operatingCostsLabel: string;
  mortgagePayment: string;
  netCashFlow: string;
  cumulativeCashFlow: string;
  status: string;

  // Yearly summary labels
  propertyValueLabel: string;
  equity: string;
  totalWealth: string;
  roi: string;

  // Stock comparison labels
  realEstate: string;
  stock7: string;
  stock10: string;
  reVs7: string;
  reVs10: string;

  // Reinvestment labels
  standardPayoff: string;
  withReinvestment: string;
  extraPayment: string;
  reinvestBalance: string;
  monthsSaved: string;
  interestSaved: string;
  paidOff: string;
}
