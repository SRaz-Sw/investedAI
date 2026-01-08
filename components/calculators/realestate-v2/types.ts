/**
 * Real Estate Calculator V2 - Type Definitions
 * 
 * This file contains all TypeScript interfaces for the real estate calculator.
 * Following the "3 engines of profit" concept with monthly granularity.
 */

// ============================================================================
// INPUT TYPES
// ============================================================================

export interface RealEstateInputs {
  // Property basics
  purchasePrice: number;          // e.g., 85000
  belowMarketPercent: number;     // 0-50, how much below market value
  monthlyRent: number;            // e.g., 1100
  
  // Growth rates
  appreciationRate: number;       // Annual property appreciation (e.g., 4%)
  rentGrowthRate: number;         // Annual rent increase (e.g., 3%)
  
  // Financing
  downPaymentPercent: number;     // 0-100
  closingCosts: number;           // One-time closing costs (e.g., 8000)
  mortgageRate: number;           // Annual interest rate (e.g., 7.5%)
  mortgageTermYears: number;      // e.g., 30
  
  // Operating expenses
  vacancyRate: number;            // e.g., 8%
  insuranceTaxMonthly: number;    // Monthly insurance + property tax
  propertyManagementPercent: number; // % of rent
  maintenancePercent: number;     // % of property value annually
}

// ============================================================================
// DERIVED VALUES
// ============================================================================

export interface DerivedValues {
  marketValue: number;            // Calculated from purchasePrice & belowMarketPercent
  instantEquity: number;          // marketValue - purchasePrice
  downPayment: number;            // purchasePrice * downPaymentPercent
  loanAmount: number;             // purchasePrice - downPayment
  monthlyMortgage: number;        // Calculated P&I payment
  totalCashRequired: number;      // downPayment + closingCosts (total cash to close)
}

// ============================================================================
// EXPENSE BREAKDOWN
// ============================================================================

export interface MonthlyExpenses {
  vacancy: number;
  insuranceTax: number;
  management: number;
  maintenance: number;
  total: number;
}

// ============================================================================
// THREE ENGINES BREAKDOWN
// ============================================================================

export interface EngineBreakdown {
  value: number;
  percent: number;
}

export interface ThreeEngines {
  cashFlow: EngineBreakdown;
  appreciation: EngineBreakdown;
  principalPaydown: EngineBreakdown;
}

// ============================================================================
// YEAR 1 RESULTS
// ============================================================================

export interface Year1Results {
  noLeverage: {
    netMonthly: number;
    annualCashFlow: number;
    appreciation: number;
    totalReturn: number;
    roi: number;
  };
  withLeverage: {
    netMonthly: number;
    annualCashFlow: number;
    appreciation: number;
    principalPaydown: number;
    totalReturn: number;
    roi: number;
    engines: ThreeEngines;
  };
}

// ============================================================================
// CHART DATA TYPES
// ============================================================================

/**
 * Data point for each month in the projection chart.
 * This is what Recharts will consume.
 */
export interface ChartDataPoint {
  month: number;                  // 0-360
  year: number;                   // 1-30
  label: string;                  // "1.01", "1.06", "2.01", etc.
  
  // For the chart lines
  monthlyRent: number;            // Current rent at this month
  propertyValue: number;          // Current market value
  mortgageBalance: number;        // Remaining loan balance
  equity: number;                 // propertyValue - mortgageBalance
  equityPercent: number;          // (equity / propertyValue) * 100
  netWorth: number;               // propertyValue - mortgageBalance + cumulativeCashFlow
  
  // For tooltips
  monthlyCashFlow: number;        // Net cash flow this month
  cumulativeCashFlow: number;     // Total cash flow since start
  totalEquityBuilt: number;       // downPayment + appreciation + principal paid
}

// ============================================================================
// PROJECTION DATA (Final output)
// ============================================================================

export interface ProjectionData {
  chartData: ChartDataPoint[];
  summary: {
    year1: Year1Results;
    year15: ChartDataPoint;
    year30: ChartDataPoint;
    averageAnnualROI: number;
  };
}

// ============================================================================
// SLIDER CONFIGURATION
// ============================================================================

export interface SliderConfig {
  label: string;
  helpText: string;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  advanced?: boolean;
}

export type SliderConfigs = Record<keyof RealEstateInputs, SliderConfig>;

// ============================================================================
// URL PARAMETER KEYS (short keys for URL)
// ============================================================================

export const URL_KEYS: Record<keyof RealEstateInputs, string> = {
  purchasePrice: 'pp',
  belowMarketPercent: 'bm',
  monthlyRent: 'mr',
  appreciationRate: 'ar',
  rentGrowthRate: 'rg',
  downPaymentPercent: 'dp',
  closingCosts: 'cc',
  vacancyRate: 'vr',
  insuranceTaxMonthly: 'it',
  propertyManagementPercent: 'pm',
  maintenancePercent: 'mt',
  mortgageRate: 'mi',
  mortgageTermYears: 'my',
};

// ============================================================================
// DEFAULT VALUES
// ============================================================================

export const DEFAULT_INPUTS: RealEstateInputs = {
  purchasePrice: 85000,
  belowMarketPercent: 0,
  monthlyRent: 1100,
  appreciationRate: 4,
  rentGrowthRate: 3,
  downPaymentPercent: 25,
  closingCosts: 8000,
  vacancyRate: 8,
  insuranceTaxMonthly: 200,
  propertyManagementPercent: 0,
  maintenancePercent: 0,
  mortgageRate: 7.5,
  mortgageTermYears: 30,
};

