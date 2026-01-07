/**
 * Real Estate Calculator V2 - Calculation Module
 * 
 * This file contains PURE FUNCTIONS ONLY - no React, no side effects.
 * All calculations are optimized for performance with O(n) time complexity.
 * 
 * Key optimizations:
 * 1. Pre-calculate constants outside loops
 * 2. Use incremental calculations instead of Math.pow each iteration
 * 3. Track running balances instead of recalculating from scratch
 * 4. Single pass through the data
 * 5. Pre-allocate array sizes
 */

import type {
  RealEstateInputs,
  DerivedValues,
  MonthlyExpenses,
  ChartDataPoint,
  ProjectionData,
  Year1Results,
  ThreeEngines,
} from '../types';

// ============================================================================
// CORE MORTGAGE CALCULATIONS
// ============================================================================

/**
 * Calculate monthly mortgage payment using standard amortization formula.
 * 
 * Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
 * Where:
 *   M = Monthly payment
 *   P = Principal (loan amount)
 *   r = Monthly interest rate (annual rate / 12)
 *   n = Total number of payments (years * 12)
 */
export function calculateMonthlyMortgage(
  principal: number,
  annualRate: number,
  termYears: number
): number {
  if (principal <= 0) return 0;
  
  const monthlyRate = annualRate / 100 / 12;
  const numPayments = termYears * 12;
  
  if (monthlyRate === 0) return principal / numPayments;
  
  return (
    (principal * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
    (Math.pow(1 + monthlyRate, numPayments) - 1)
  );
}

/**
 * Calculate remaining mortgage balance at a specific month.
 * 
 * Formula: B = P * [(1+r)^n - (1+r)^p] / [(1+r)^n - 1]
 * Where:
 *   B = Remaining balance
 *   P = Original principal
 *   r = Monthly interest rate
 *   n = Total number of payments
 *   p = Number of payments made
 */
export function calculateRemainingBalance(
  principal: number,
  annualRate: number,
  termYears: number,
  monthsPaid: number
): number {
  if (principal <= 0 || monthsPaid >= termYears * 12) return 0;
  
  const monthlyRate = annualRate / 100 / 12;
  const totalPayments = termYears * 12;
  
  if (monthlyRate === 0) {
    return principal - (principal / totalPayments) * monthsPaid;
  }
  
  const balance =
    principal *
    (Math.pow(1 + monthlyRate, totalPayments) - Math.pow(1 + monthlyRate, monthsPaid)) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1);
  
  return Math.max(0, balance);
}

// ============================================================================
// DERIVED VALUES CALCULATION
// ============================================================================

/**
 * Calculate derived values from inputs (market value, down payment, etc.)
 */
export function calculateDerivedValues(inputs: RealEstateInputs): DerivedValues {
  const { 
    purchasePrice, 
    belowMarketPercent, 
    downPaymentPercent, 
    mortgageRate, 
    mortgageTermYears 
  } = inputs;
  
  // If bought 30% below market, marketValue = purchasePrice / (1 - 0.30)
  const marketValue = belowMarketPercent > 0
    ? purchasePrice / (1 - belowMarketPercent / 100)
    : purchasePrice;
  
  const instantEquity = marketValue - purchasePrice;
  const downPayment = purchasePrice * (downPaymentPercent / 100);
  const loanAmount = purchasePrice - downPayment;
  const monthlyMortgage = calculateMonthlyMortgage(loanAmount, mortgageRate, mortgageTermYears);
  
  return {
    marketValue,
    instantEquity,
    downPayment,
    loanAmount,
    monthlyMortgage,
  };
}

// ============================================================================
// MONTHLY EXPENSES CALCULATION
// ============================================================================

/**
 * Calculate monthly operating expenses based on current values.
 */
export function calculateMonthlyExpenses(
  currentRent: number,
  currentValue: number,
  inputs: RealEstateInputs
): MonthlyExpenses {
  const vacancy = currentRent * (inputs.vacancyRate / 100);
  const insuranceTax = inputs.insuranceTaxMonthly;
  const management = currentRent * (inputs.propertyManagementPercent / 100);
  const maintenance = currentValue * (inputs.maintenancePercent / 100) / 12;
  
  return {
    vacancy,
    insuranceTax,
    management,
    maintenance,
    total: vacancy + insuranceTax + management + maintenance,
  };
}

// ============================================================================
// YEAR 1 RESULTS CALCULATION
// ============================================================================

/**
 * Calculate detailed Year 1 results including 3 engines breakdown.
 */
export function calculateYear1Results(
  inputs: RealEstateInputs,
  derived: DerivedValues
): Year1Results {
  const { 
    monthlyRent, 
    appreciationRate, 
    mortgageRate 
  } = inputs;
  
  const { 
    marketValue, 
    downPayment, 
    loanAmount, 
    monthlyMortgage 
  } = derived;
  
  // Calculate monthly expenses at year 1
  const monthlyExpenses = calculateMonthlyExpenses(monthlyRent, marketValue, inputs);
  
  // === NO LEVERAGE SCENARIO (100% cash purchase) ===
  const noLeverageNetMonthly = monthlyRent - monthlyExpenses.total;
  const noLeverageAnnualCashFlow = noLeverageNetMonthly * 12;
  const noLeverageAppreciation = marketValue * (appreciationRate / 100);
  const noLeverageTotalReturn = noLeverageAnnualCashFlow + noLeverageAppreciation;
  const noLeverageROI = marketValue > 0 
    ? (noLeverageTotalReturn / marketValue) * 100 
    : 0;
  
  // === WITH LEVERAGE SCENARIO ===
  const withLeverageNetMonthly = monthlyRent - monthlyExpenses.total - monthlyMortgage;
  const withLeverageAnnualCashFlow = withLeverageNetMonthly * 12;
  const withLeverageAppreciation = marketValue * (appreciationRate / 100);
  
  // Calculate Year 1 principal paydown
  let year1PrincipalPaydown = 0;
  let balance = loanAmount;
  const monthlyInterestRate = mortgageRate / 100 / 12;
  
  for (let month = 0; month < 12 && balance > 0; month++) {
    const interestPayment = balance * monthlyInterestRate;
    const principalPayment = Math.min(monthlyMortgage - interestPayment, balance);
    year1PrincipalPaydown += principalPayment;
    balance -= principalPayment;
  }
  
  const withLeverageTotalReturn = 
    withLeverageAnnualCashFlow + 
    withLeverageAppreciation + 
    year1PrincipalPaydown;
  
  const withLeverageROI = downPayment > 0 
    ? (withLeverageTotalReturn / downPayment) * 100 
    : 0;
  
  // === THREE ENGINES BREAKDOWN ===
  const totalEngineValue = 
    withLeverageAnnualCashFlow + 
    withLeverageAppreciation + 
    year1PrincipalPaydown;
  
  const engines: ThreeEngines = {
    cashFlow: {
      value: withLeverageAnnualCashFlow,
      percent: totalEngineValue !== 0 
        ? (withLeverageAnnualCashFlow / totalEngineValue) * 100 
        : 0,
    },
    appreciation: {
      value: withLeverageAppreciation,
      percent: totalEngineValue !== 0 
        ? (withLeverageAppreciation / totalEngineValue) * 100 
        : 0,
    },
    principalPaydown: {
      value: year1PrincipalPaydown,
      percent: totalEngineValue !== 0 
        ? (year1PrincipalPaydown / totalEngineValue) * 100 
        : 0,
    },
  };
  
  return {
    noLeverage: {
      netMonthly: noLeverageNetMonthly,
      annualCashFlow: noLeverageAnnualCashFlow,
      appreciation: noLeverageAppreciation,
      totalReturn: noLeverageTotalReturn,
      roi: noLeverageROI,
    },
    withLeverage: {
      netMonthly: withLeverageNetMonthly,
      annualCashFlow: withLeverageAnnualCashFlow,
      appreciation: withLeverageAppreciation,
      principalPaydown: year1PrincipalPaydown,
      totalReturn: withLeverageTotalReturn,
      roi: withLeverageROI,
      engines,
    },
  };
}

// ============================================================================
// MAIN PROJECTION GENERATOR
// ============================================================================

/**
 * Generate full 30-year projection data for the chart.
 * Returns monthly data points (361 points: month 0 to 360).
 * 
 * PERFORMANCE OPTIMIZATIONS:
 * 1. Pre-calculate constants outside the loop
 * 2. Use incremental calculations (multiply by growth factor) instead of Math.pow
 * 3. Track running balance instead of recalculating from scratch
 * 4. Single pass through the data
 * 5. Pre-allocate array size
 * 
 * Time complexity: O(n) where n = 361 months
 * Space complexity: O(n) for the output array
 */
export function generateProjectionData(inputs: RealEstateInputs): ProjectionData {
  const derived = calculateDerivedValues(inputs);
  
  const {
    monthlyRent: initialRent,
    appreciationRate,
    rentGrowthRate,
    vacancyRate,
    insuranceTaxMonthly,
    propertyManagementPercent,
    maintenancePercent,
    mortgageRate,
    mortgageTermYears,
  } = inputs;
  
  const { 
    marketValue: initialMarketValue, 
    downPayment, 
    loanAmount, 
    monthlyMortgage 
  } = derived;
  
  // === PRE-CALCULATE CONSTANTS (avoid repeated calculations in loop) ===
  const TOTAL_MONTHS = mortgageTermYears * 12;
  const monthlyAppreciationFactor = Math.pow(1 + appreciationRate / 100, 1 / 12);
  const yearlyRentGrowthFactor = 1 + rentGrowthRate / 100; // Rent increases once per year
  const monthlyInterestRate = mortgageRate / 100 / 12;
  const vacancyFactor = vacancyRate / 100;
  const managementFactor = propertyManagementPercent / 100;
  const maintenanceMonthlyFactor = (maintenancePercent / 100) / 12;
  
  // Pre-allocate array for better memory performance
  const chartData: ChartDataPoint[] = new Array(TOTAL_MONTHS + 1);
  
  // === RUNNING STATE VARIABLES (incremental calculation) ===
  let currentRent = initialRent;
  let currentValue = initialMarketValue;
  let mortgageBalance = loanAmount;
  let cumulativeCashFlow = 0;
  
  // === MAIN CALCULATION LOOP ===
  for (let month = 0; month <= TOTAL_MONTHS; month++) {
    const year = Math.floor(month / 12) + 1;
    const monthInYear = (month % 12) + 1;
    
    // === MORTGAGE BALANCE (incremental) ===
    if (month > 0 && mortgageBalance > 0) {
      const interestPayment = mortgageBalance * monthlyInterestRate;
      const principalPayment = Math.min(monthlyMortgage - interestPayment, mortgageBalance);
      mortgageBalance = Math.max(0, mortgageBalance - principalPayment);
    }
    
    // === GROWTH ===
    if (month > 0) {
      // Property appreciates monthly (compounded)
      currentValue *= monthlyAppreciationFactor;
      // Rent increases once per year (at the start of each new year)
      if (month % 12 === 0) {
        currentRent *= yearlyRentGrowthFactor;
      }
    }
    
    // === EQUITY CALCULATION ===
    const equity = currentValue - mortgageBalance;
    const equityPercent = currentValue > 0 ? (equity / currentValue) * 100 : 0;
    
    // === EXPENSES (all based on current values) ===
    const vacancyLoss = currentRent * vacancyFactor;
    const managementFee = currentRent * managementFactor;
    const maintenanceCost = currentValue * maintenanceMonthlyFactor;
    const totalExpenses = vacancyLoss + insuranceTaxMonthly + managementFee + maintenanceCost;
    
    // === CASH FLOW ===
    const effectiveMortgage = mortgageBalance > 0 ? monthlyMortgage : 0;
    const monthlyCashFlow = currentRent - totalExpenses - effectiveMortgage;
    cumulativeCashFlow += monthlyCashFlow;
    
    // === TOTAL EQUITY BUILT ===
    const appreciationGained = currentValue - initialMarketValue;
    const principalPaid = loanAmount - mortgageBalance;
    const totalEquityBuilt = downPayment + appreciationGained + principalPaid;
    
    // === STORE DATA POINT ===
    chartData[month] = {
      month,
      year,
      label: `${year}.${monthInYear.toString().padStart(2, '0')}`,
      monthlyRent: currentRent,
      propertyValue: currentValue,
      mortgageBalance,
      equity,
      equityPercent,
      monthlyCashFlow,
      cumulativeCashFlow,
      totalEquityBuilt,
    };
  }
  
  // === CALCULATE YEAR 1 RESULTS ===
  const year1 = calculateYear1Results(inputs, derived);
  
  // === EXTRACT SUMMARY POINTS ===
  return {
    chartData,
    summary: {
      year1,
      year15: chartData[Math.min(180, TOTAL_MONTHS)],
      year30: chartData[TOTAL_MONTHS],
    },
  };
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Sample chart data for better rendering performance.
 * Keeps every 3rd month but preserves yearly endpoints for accuracy.
 */
export function sampleChartData(chartData: ChartDataPoint[]): ChartDataPoint[] {
  return chartData.filter((point, index) => {
    const isYearEnd = point.month % 12 === 0;
    const isSampled = index % 3 === 0;
    const isLastPoint = index === chartData.length - 1;
    return isYearEnd || isSampled || isLastPoint;
  });
}

/**
 * Round a number to appropriate precision for display.
 */
export function roundForDisplay(value: number): number {
  if (Math.abs(value) >= 1000000) return Math.round(value / 1000) * 1000;
  if (Math.abs(value) >= 10000) return Math.round(value / 100) * 100;
  if (Math.abs(value) >= 1000) return Math.round(value / 10) * 10;
  return Math.round(value);
}

/**
 * Format currency for chart axis labels.
 */
export function formatAxisValue(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

