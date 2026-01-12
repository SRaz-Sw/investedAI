import type { Language } from '@/lib/translations';
import type { ExcelTranslations } from './types';

export const excelTranslations: Record<Language, ExcelTranslations> = {
  en: {
    // Button states
    exportToExcel: 'Export to Excel',
    downloading: 'Downloading...',
    downloadComplete: 'Downloaded!',

    // Sheet names
    sheetDashboard: 'Dashboard',
    sheetAmortization: 'Amortization',
    sheetMonthlyCashFlow: 'Monthly Cash Flow',
    sheetYearlySummary: 'Yearly Summary',
    sheetStockComparison: 'Stock Comparison',
    sheetReinvestment: 'Reinvestment',
    sheetChartData: 'Chart Data',

    // Dashboard labels
    inputs: 'INPUTS',
    editableNote: '(Yellow cells are editable - change values to recalculate)',
    propertyValue: 'Property Value',
    downPaymentPercent: 'Down Payment (%)',
    downPaymentAmount: 'Down Payment ($)',
    monthlyRent: 'Monthly Rent',
    appreciation: 'Annual Appreciation (%)',
    mortgageRate: 'Mortgage Rate (%)',
    mortgageTerm: 'Mortgage Term (years)',
    rentGrowth: 'Annual Rent Growth (%)',
    operatingCosts: 'Operating Costs (% of property)',
    stockReturnRate: 'Stock Return Rate (%)',

    derivedValues: 'CALCULATED VALUES',
    loanAmount: 'Loan Amount',
    monthlyMortgage: 'Monthly Mortgage Payment',
    annualOperatingCosts: 'Annual Operating Costs',

    threePillars: 'THE 3 PILLARS OF WEALTH',
    cashFlow: 'Cash Flow',
    equityBuilt: 'Equity Built',
    appreciationGains: 'Appreciation',
    accumulated: 'Accumulated',
    loanPaidOff: 'Loan Paid Off',
    propertyGrowth: 'Property Growth',

    totalResults: 'TOTAL RESULTS',
    totalWealthBuilt: 'Total Wealth Built',
    yourInvestment: 'Your Investment',
    totalROI: 'Total ROI',
    annualizedROI: 'Annualized ROI',
    leverageEffect: 'Leverage Effect',

    vsStockMarket: 'VS STOCK MARKET',
    stockAt7: 'Stocks at 7%',
    stockAt10: 'Stocks at 10%',
    realEstateWealth: 'Real Estate Wealth',
    winner: 'Winner',
    years: 'years',

    // Amortization labels
    month: 'Month',
    payment: 'Payment',
    principal: 'Principal',
    interest: 'Interest',
    balance: 'Balance',
    equityPercent: 'Equity %',
    cumulativeInterest: 'Cumulative Interest',
    totals: 'TOTALS',

    // Cash flow labels
    year: 'Year',
    rentIncome: 'Rent Income',
    operatingCostsLabel: 'Operating Costs',
    mortgagePayment: 'Mortgage',
    netCashFlow: 'Net Cash Flow',
    cumulativeCashFlow: 'Cumulative Cash Flow',
    status: 'Status',

    // Yearly summary labels
    propertyValueLabel: 'Property Value',
    equity: 'Equity',
    totalWealth: 'Total Wealth',
    roi: 'ROI',

    // Stock comparison labels
    realEstate: 'Real Estate',
    stock7: 'Stock @ 7%',
    stock10: 'Stock @ 10%',
    reVs7: 'RE vs 7%',
    reVs10: 'RE vs 10%',

    // Reinvestment labels
    standardPayoff: 'Standard Balance',
    withReinvestment: 'With Reinvestment',
    extraPayment: 'Extra Payment',
    reinvestBalance: 'Reinvest Balance',
    monthsSaved: 'Months Saved',
    interestSaved: 'Interest Saved',
    paidOff: 'PAID OFF',
  },

  he: {
    // Button states
    exportToExcel: 'ייצוא לאקסל',
    downloading: 'מוריד...',
    downloadComplete: 'הורדה הושלמה!',

    // Sheet names
    sheetDashboard: 'לוח בקרה',
    sheetAmortization: 'לוח סילוקין',
    sheetMonthlyCashFlow: 'תזרים חודשי',
    sheetYearlySummary: 'סיכום שנתי',
    sheetStockComparison: 'השוואה למניות',
    sheetReinvestment: 'השקעה מחדש',
    sheetChartData: 'נתונים לגרפים',

    // Dashboard labels
    inputs: 'נתוני קלט',
    editableNote: '(תאים צהובים ניתנים לעריכה - שנה ערכים לחישוב מחדש)',
    propertyValue: 'שווי הנכס',
    downPaymentPercent: 'הון עצמי (%)',
    downPaymentAmount: 'הון עצמי (₪)',
    monthlyRent: 'שכירות חודשית',
    appreciation: 'עליית ערך שנתית (%)',
    mortgageRate: 'ריבית משכנתא (%)',
    mortgageTerm: 'תקופת משכנתא (שנים)',
    rentGrowth: 'עליית שכירות שנתית (%)',
    operatingCosts: 'עלויות תפעול (% מהנכס)',
    stockReturnRate: 'תשואת מניות (%)',

    derivedValues: 'ערכים מחושבים',
    loanAmount: 'סכום ההלוואה',
    monthlyMortgage: 'החזר משכנתא חודשי',
    annualOperatingCosts: 'עלויות תפעול שנתיות',

    threePillars: '3 עמודי הבניית העושר',
    cashFlow: 'תזרים מזומנים',
    equityBuilt: 'הון עצמי שנבנה',
    appreciationGains: 'עליית ערך',
    accumulated: 'מצטבר',
    loanPaidOff: 'הלוואה נפרעה',
    propertyGrowth: 'עליית ערך הנכס',

    totalResults: 'תוצאות סופיות',
    totalWealthBuilt: 'סך העושר שנבנה',
    yourInvestment: 'ההשקעה שלך',
    totalROI: 'תשואה כוללת',
    annualizedROI: 'תשואה שנתית',
    leverageEffect: 'אפקט המינוף',

    vsStockMarket: 'לעומת שוק המניות',
    stockAt7: 'מניות ב-7%',
    stockAt10: 'מניות ב-10%',
    realEstateWealth: 'עושר מנדל"ן',
    winner: 'מנצח',
    years: 'שנים',

    // Amortization labels
    month: 'חודש',
    payment: 'תשלום',
    principal: 'קרן',
    interest: 'ריבית',
    balance: 'יתרה',
    equityPercent: '% הון עצמי',
    cumulativeInterest: 'ריבית מצטברת',
    totals: 'סיכום',

    // Cash flow labels
    year: 'שנה',
    rentIncome: 'הכנסה משכירות',
    operatingCostsLabel: 'עלויות תפעול',
    mortgagePayment: 'משכנתא',
    netCashFlow: 'תזרים נטו',
    cumulativeCashFlow: 'תזרים מצטבר',
    status: 'סטטוס',

    // Yearly summary labels
    propertyValueLabel: 'שווי נכס',
    equity: 'הון עצמי',
    totalWealth: 'סך העושר',
    roi: 'תשואה',

    // Stock comparison labels
    realEstate: 'נדל"ן',
    stock7: 'מניות @ 7%',
    stock10: 'מניות @ 10%',
    reVs7: 'נדל"ן לעומת 7%',
    reVs10: 'נדל"ן לעומת 10%',

    // Reinvestment labels
    standardPayoff: 'יתרה רגילה',
    withReinvestment: 'עם השקעה מחדש',
    extraPayment: 'תשלום נוסף',
    reinvestBalance: 'יתרה עם השקעה',
    monthsSaved: 'חודשים שנחסכו',
    interestSaved: 'ריבית שנחסכה',
    paidOff: 'נפרע!',
  },
};
