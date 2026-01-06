import { Language } from './index';

export interface RealEstateTranslation {
  // Page titles
  title: string;
  subtitle: string;

  // Simple inputs
  propertyValue: string;
  downPayment: string;
  monthlyRent: string;
  appreciation: string;

  // Advanced inputs
  advancedSettings: string;
  mortgageRate: string;
  mortgageTerm: string;
  rentGrowth: string;
  operatingCosts: string;
  vacancyRate: string;

  // 3 Pillars
  cashFlow: string;
  cashFlowDesc: string;
  equityBuilding: string;
  equityBuildingDesc: string;
  appreciationGains: string;
  appreciationGainsDesc: string;
  tenantPaysMortgage: string;
  
  // Time-based labels
  today: string;
  inYears: string;
  afterMortgage: string;
  total: string;
  perMonth: string;
  perYear: string;

  // Summary section
  totalWealthBuilt: string;
  yourInvestment: string;
  totalROI: string;
  annualizedROI: string;

  // Chart labels
  wealthOverTime: string;
  accumulatedCashFlow: string;
  accumulatedEquity: string;
  accumulatedAppreciation: string;
  years: string;

  // Crossover chart
  cashFlowEvolution: string;
  rentIncome: string;
  mortgagePayment: string;
  fixedPayment: string;
  growingIncome: string;

  // Milestones
  keyMilestones: string;
  year: string;
  tight: string;
  comfortable: string;
  strong: string;
  mortgagePaidOff: string;
  pureProfit: string;

  // Leverage callout
  leveragePower: string;
  leverageExplanation: string;
  appreciationOn: string;
  butYouOnlyInvested: string;
  thatsReturn: string;
  bankMoneyWorksForYou: string;

  // Units
  currency: string;
  yearsLabel: string;

  // Help button
  close: string;

  // Slider info
  propertyValue_info: string;
  propertyValue_desc: string;
  downPayment_info: string;
  downPayment_desc: string;
  monthlyRent_info: string;
  monthlyRent_desc: string;
  appreciation_info: string;
  appreciation_desc: string;
  mortgageRate_info: string;
  mortgageRate_desc: string;
  mortgageTerm_info: string;
  mortgageTerm_desc: string;
  rentGrowth_info: string;
  rentGrowth_desc: string;
  operatingCosts_info: string;
  operatingCosts_desc: string;
}

export const realEstateTranslations: Record<Language, RealEstateTranslation> = {
  en: {
    // Page titles
    title: "Real Estate Wealth Builder",
    subtitle: "See how real estate builds wealth through 3 powerful mechanisms",

    // Simple inputs
    propertyValue: "Property Value",
    downPayment: "Down Payment",
    monthlyRent: "Monthly Rent",
    appreciation: "Annual Appreciation",

    // Advanced inputs
    advancedSettings: "Advanced Settings",
    mortgageRate: "Mortgage Rate",
    mortgageTerm: "Mortgage Term",
    rentGrowth: "Annual Rent Growth",
    operatingCosts: "Operating Costs",
    vacancyRate: "Vacancy Rate",

    // 3 Pillars
    cashFlow: "Cash Flow",
    cashFlowDesc: "Money in your pocket",
    equityBuilding: "Equity Building",
    equityBuildingDesc: "Tenant pays your mortgage",
    appreciationGains: "Appreciation",
    appreciationGainsDesc: "Property value growth",
    tenantPaysMortgage: "tenant pays your loan",

    // Time-based labels
    today: "Today",
    inYears: "In {n} years",
    afterMortgage: "After mortgage",
    total: "Total",
    perMonth: "/mo",
    perYear: "/yr",

    // Summary section
    totalWealthBuilt: "Total Wealth Built",
    yourInvestment: "Your Investment",
    totalROI: "Total ROI",
    annualizedROI: "Annualized",

    // Chart labels
    wealthOverTime: "Your Wealth Building Over Time",
    accumulatedCashFlow: "Cash Flow",
    accumulatedEquity: "Equity from Mortgage",
    accumulatedAppreciation: "Appreciation",
    years: "Years",

    // Crossover chart
    cashFlowEvolution: "The Power of Time: Fixed Costs, Growing Income",
    rentIncome: "Rent Income",
    mortgagePayment: "Mortgage Payment",
    fixedPayment: "Fixed",
    growingIncome: "Growing",

    // Milestones
    keyMilestones: "Your Journey",
    year: "Year",
    tight: "Building foundation",
    comfortable: "Getting comfortable",
    strong: "Strong returns",
    mortgagePaidOff: "Mortgage paid off!",
    pureProfit: "Pure profit",

    // Leverage callout
    leveragePower: "Leverage Superpower",
    leverageExplanation: "This is why real estate builds wealth faster",
    appreciationOn: "appreciation on",
    butYouOnlyInvested: "But you only invested",
    thatsReturn: "That's a {n}% return on YOUR cash!",
    bankMoneyWorksForYou: "The bank's money works for you",

    // Units
    currency: "$",
    yearsLabel: "years",

    // Help button
    close: "Close",

    // Slider info
    propertyValue_info: "Property Value",
    propertyValue_desc: "The total purchase price of the property. This is the foundation for all calculations.",
    downPayment_info: "Down Payment",
    downPayment_desc: "Your initial cash investment. A larger down payment means less leverage but also lower monthly payments.",
    monthlyRent_info: "Monthly Rent",
    monthlyRent_desc: "Expected monthly rental income. Research comparable rentals in the area for realistic estimates.",
    appreciation_info: "Annual Appreciation",
    appreciation_desc: "Expected yearly increase in property value. Historical averages range from 2-5% depending on location.",
    mortgageRate_info: "Mortgage Interest Rate",
    mortgageRate_desc: "The annual interest rate on your mortgage. This significantly impacts your monthly payment and total interest paid.",
    mortgageTerm_info: "Mortgage Term",
    mortgageTerm_desc: "Length of the mortgage in years. Longer terms mean lower payments but more total interest.",
    rentGrowth_info: "Annual Rent Growth",
    rentGrowth_desc: "Expected yearly increase in rent. Typically tracks inflation at 2-3% per year.",
    operatingCosts_info: "Operating Costs",
    operatingCosts_desc: "Annual costs as percentage of property value. Includes maintenance, insurance, property taxes, and management fees. Typically 1-2%.",
  },
  he: {
    // Page titles
    title: "בונה העושר הנדל\"ני",
    subtitle: "ראה איך נדל\"ן בונה עושר דרך 3 מנגנונים חזקים",

    // Simple inputs
    propertyValue: "שווי הנכס",
    downPayment: "הון עצמי",
    monthlyRent: "שכירות חודשית",
    appreciation: "עליית ערך שנתית",

    // Advanced inputs
    advancedSettings: "הגדרות מתקדמות",
    mortgageRate: "ריבית משכנתא",
    mortgageTerm: "תקופת משכנתא",
    rentGrowth: "עליית שכירות שנתית",
    operatingCosts: "עלויות תפעול",
    vacancyRate: "שיעור תפוסה",

    // 3 Pillars
    cashFlow: "תזרים מזומנים",
    cashFlowDesc: "כסף בכיס שלך",
    equityBuilding: "בניית הון",
    equityBuildingDesc: "השוכר משלם את המשכנתא",
    appreciationGains: "עליית ערך",
    appreciationGainsDesc: "צמיחת שווי הנכס",
    tenantPaysMortgage: "השוכר משלם את ההלוואה",

    // Time-based labels
    today: "היום",
    inYears: "בעוד {n} שנים",
    afterMortgage: "אחרי המשכנתא",
    total: "סה\"כ",
    perMonth: "/חודש",
    perYear: "/שנה",

    // Summary section
    totalWealthBuilt: "סה\"כ עושר שנבנה",
    yourInvestment: "ההשקעה שלך",
    totalROI: "תשואה כוללת",
    annualizedROI: "תשואה שנתית",

    // Chart labels
    wealthOverTime: "בניית העושר שלך לאורך זמן",
    accumulatedCashFlow: "תזרים מזומנים",
    accumulatedEquity: "הון מהמשכנתא",
    accumulatedAppreciation: "עליית ערך",
    years: "שנים",

    // Crossover chart
    cashFlowEvolution: "כוח הזמן: עלויות קבועות, הכנסה צומחת",
    rentIncome: "הכנסה משכירות",
    mortgagePayment: "תשלום משכנתא",
    fixedPayment: "קבוע",
    growingIncome: "צומח",

    // Milestones
    keyMilestones: "המסע שלך",
    year: "שנה",
    tight: "בניית בסיס",
    comfortable: "נוח יותר",
    strong: "תשואות חזקות",
    mortgagePaidOff: "המשכנתא נפרעה!",
    pureProfit: "רווח נקי",

    // Leverage callout
    leveragePower: "כוח המינוף",
    leverageExplanation: "זו הסיבה שנדל\"ן בונה עושר מהר יותר",
    appreciationOn: "עליית ערך על",
    butYouOnlyInvested: "אבל השקעת רק",
    thatsReturn: "זו תשואה של {n}% על הכסף שלך!",
    bankMoneyWorksForYou: "הכסף של הבנק עובד בשבילך",

    // Units
    currency: "₪",
    yearsLabel: "שנים",

    // Help button
    close: "סגור",

    // Slider info
    propertyValue_info: "שווי הנכס",
    propertyValue_desc: "מחיר הרכישה הכולל של הנכס. זהו הבסיס לכל החישובים.",
    downPayment_info: "הון עצמי",
    downPayment_desc: "ההשקעה הראשונית שלך במזומן. הון עצמי גדול יותר פירושו פחות מינוף אבל גם תשלומים חודשיים נמוכים יותר.",
    monthlyRent_info: "שכירות חודשית",
    monthlyRent_desc: "הכנסת שכירות חודשית צפויה. חקור נכסים דומים באזור להערכות ריאליסטיות.",
    appreciation_info: "עליית ערך שנתית",
    appreciation_desc: "עלייה שנתית צפויה בשווי הנכס. ממוצעים היסטוריים נעים בין 2-5% תלוי במיקום.",
    mortgageRate_info: "ריבית משכנתא",
    mortgageRate_desc: "שיעור הריבית השנתי על המשכנתא. זה משפיע משמעותית על התשלום החודשי וסך הריבית ששולמה.",
    mortgageTerm_info: "תקופת משכנתא",
    mortgageTerm_desc: "אורך המשכנתא בשנים. תקופות ארוכות יותר פירושן תשלומים נמוכים יותר אך יותר ריבית כוללת.",
    rentGrowth_info: "עליית שכירות שנתית",
    rentGrowth_desc: "עלייה שנתית צפויה בשכירות. בדרך כלל עוקבת אחרי האינפלציה ב-2-3% בשנה.",
    operatingCosts_info: "עלויות תפעול",
    operatingCosts_desc: "עלויות שנתיות כאחוז משווי הנכס. כולל תחזוקה, ביטוח, מסי נכס ודמי ניהול. בדרך כלל 1-2%.",
  },
};
