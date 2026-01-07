import { Language } from './index';

export interface LandingTranslation {
  // Hero Section
  heroTitle: string;
  heroSubtitleRegular: string;
  heroSubtitleGradient: string;
  heroDescription: string;
  exploreCalculators: string;
  learnMore: string;
  
  // Value Proposition Section
  whyChooseTitle: string;
  whyChooseDescription: string;
  aiPoweredTitle: string;
  aiPoweredDescription: string;
  longTermGrowthTitle: string;
  longTermGrowthDescription: string;
  financialSecurityTitle: string;
  financialSecurityDescription: string;
  
  // How It Works Section
  howItWorksTitle: string;
  howItWorksDescription: string;
  step1Title: string;
  step1Description: string;
  step2Title: string;
  step2Description: string;
  step3Title: string;
  step3Description: string;
  
  // Calculators Section
  calculatorsTitle: string;
  calculatorsDescription: string;
  portfolioLoanTitle: string;
  portfolioLoanDescription: string;
  portfolioBenefit1: string;
  portfolioBenefit2: string;
  portfolioBenefit3: string;
  pensionTitle: string;
  pensionDescription: string;
  pensionBenefit1: string;
  pensionBenefit2: string;
  pensionBenefit3: string;
  compoundTitle: string;
  compoundDescription: string;
  compoundBenefit1: string;
  compoundBenefit2: string;
  compoundBenefit3: string;
  taxTitle: string;
  taxDescription: string;
  taxBenefit1: string;
  taxBenefit2: string;
  taxBenefit3: string;
  realEstateTitle: string;
  realEstateDescription: string;
  realEstateBenefit1: string;
  realEstateBenefit2: string;
  realEstateBenefit3: string;
  tryCalculator: string;
  
  // Testimonials Section
  testimonialsTitle: string;
  testimonialsDescription: string;
  testimonial1Content: string;
  testimonial1Author: string;
  testimonial1Role: string;
  testimonial2Content: string;
  testimonial2Author: string;
  testimonial2Role: string;
  testimonial3Content: string;
  testimonial3Author: string;
  testimonial3Role: string;
  
  // CTA Section
  ctaTitle: string;
  ctaDescription: string;
  tryOurCalculators: string;
}

export const landingTranslations: Record<Language, LandingTranslation> = {
  en: {
    // Hero Section
    heroTitle: "Financial Freedom Starts Here",
    heroSubtitleRegular: "Pay today's bills, ",
    heroSubtitleGradient: "Build tomorrow's wealth",
    heroDescription: "Make informed financial decisions that balance your current needs while maximizing future growth potential with our AI-powered calculators.",
    exploreCalculators: "Explore Calculators",
    learnMore: "Learn More",
    
    // Value Proposition Section
    whyChooseTitle: "Why Choose Invested AI?",
    whyChooseDescription: "Our suite of financial tools helps you make smarter decisions about your money.",
    aiPoweredTitle: "AI-Powered Insights",
    aiPoweredDescription: "Get personalized financial recommendations tailored to your unique situation and goals.",
    longTermGrowthTitle: "Long-term Growth",
    longTermGrowthDescription: "See how your decisions today impact your wealth tomorrow with detailed projections.",
    financialSecurityTitle: "Financial Security",
    financialSecurityDescription: "Make confident decisions backed by data and sophisticated financial models.",
    
    // How It Works Section
    howItWorksTitle: "How It Works",
    howItWorksDescription: "Our calculators make complex financial planning simple and accessible.",
    step1Title: "Input Your Data",
    step1Description: "Enter your financial information and goals into our user-friendly calculators.",
    step2Title: "Get Instant Analysis",
    step2Description: "Our AI analyzes your inputs and provides detailed projections and recommendations.",
    step3Title: "Make Better Decisions",
    step3Description: "Use our insights to optimize your financial strategy and build long-term wealth.",
    
    // Calculators Section
    calculatorsTitle: "Our Financial Calculators",
    calculatorsDescription: "Powerful tools to help you make informed financial decisions.",
    portfolioLoanTitle: "Portfolio Loan Calculator",
    portfolioLoanDescription: "Compare borrowing against your investments versus selling assets to meet immediate financial needs.",
    portfolioBenefit1: "Avoid potential tax implications from selling investments",
    portfolioBenefit2: "Keep your investment portfolio growing while accessing capital",
    portfolioBenefit3: "Visualize the long-term effects of different strategies",
    pensionTitle: "Pension Planning Calculator",
    pensionDescription: "Plan your retirement with confidence. Our pension calculator helps you determine how much to save today to meet your future income goals.",
    pensionBenefit1: "Adjust variables to see how they affect your retirement readiness",
    pensionBenefit2: "Account for inflation and market performance",
    pensionBenefit3: "Visualize your retirement income year by year",
    compoundTitle: "Compound Interest Calculator",
    compoundDescription: "See the power of compound interest and how your investments can grow over time with regular contributions.",
    compoundBenefit1: "Visualize the exponential growth of your investments",
    compoundBenefit2: "Compare different investment strategies",
    compoundBenefit3: "Understand the impact of contribution frequency and amount",
    taxTitle: "Tax Efficiency Calculator",
    taxDescription: "Optimize your investment strategy for tax efficiency and maximize your after-tax returns.",
    taxBenefit1: "Compare tax implications of different investment vehicles",
    taxBenefit2: "Understand how tax-advantaged accounts can boost returns",
    taxBenefit3: "Plan withdrawals to minimize tax burden",
    realEstateTitle: "Real Estate Investment Calculator",
    realEstateDescription: "Discover the 3 engines of profit in real estate: cash flow, appreciation, and equity building. See your 30-year wealth projection.",
    realEstateBenefit1: "Visualize monthly cash flow and property value growth over 30 years",
    realEstateBenefit2: "Understand the power of leverage and the 3 profit engines",
    realEstateBenefit3: "Compare scenarios with different down payments and financing",
    tryCalculator: "Try Calculator",
    
    // Testimonials Section
    testimonialsTitle: "What Our Users Say",
    testimonialsDescription: "Hear from people who have transformed their financial future with Invested AI.",
    testimonial1Content: "The Portfolio Loan Calculator helped me make a crucial decision that saved me thousands in taxes while keeping my investments growing.",
    testimonial1Author: "Sarah Johnson",
    testimonial1Role: "Small Business Owner",
    testimonial2Content: "I finally understand how much I need to save for retirement. The Pension Planning Calculator made it crystal clear.",
    testimonial2Author: "Michael Chen",
    testimonial2Role: "Software Engineer",
    testimonial3Content: "The compound interest calculator showed me the true power of starting early. I've completely changed my investment strategy.",
    testimonial3Author: "Emma Rodriguez",
    testimonial3Role: "Marketing Director",
    
    // CTA Section
    ctaTitle: "Start Building Your Financial Future Today",
    ctaDescription: "Our calculators are free to use, with no signup required. Take the first step toward financial freedom.",
    tryOurCalculators: "Try Our Calculators",
  },
  he: {
    // Hero Section
    heroTitle: "החופש הפיננסי מתחיל כאן",
    heroSubtitleRegular: "שלם את החשבונות של היום, ",
    heroSubtitleGradient: "בנה את העושר של המחר",
    heroDescription: "קבל החלטות פיננסיות מושכלות המאזנות את הצרכים הנוכחיים שלך תוך מקסום פוטנציאל הצמיחה העתידי עם המחשבונים שלנו המופעלים על ידי בינה מלאכותית.",
    exploreCalculators: "גלה את המחשבונים",
    learnMore: "למד עוד",
    
    // Value Proposition Section
    whyChooseTitle: "למה לבחור ב-Invested AI?",
    whyChooseDescription: "מגוון הכלים הפיננסיים שלנו עוזר לך לקבל החלטות חכמות יותר לגבי הכסף שלך.",
    aiPoweredTitle: "תובנות מבוססות בינה מלאכותית",
    aiPoweredDescription: "קבל המלצות פיננסיות מותאמות אישית למצב ולמטרות הייחודיים שלך.",
    longTermGrowthTitle: "צמיחה לטווח ארוך",
    longTermGrowthDescription: "ראה כיצד ההחלטות שלך היום משפיעות על העושר שלך מחר עם תחזיות מפורטות.",
    financialSecurityTitle: "ביטחון פיננסי",
    financialSecurityDescription: "קבל החלטות בביטחון המגובות בנתונים ובמודלים פיננסיים מתוחכמים.",
    
    // How It Works Section
    howItWorksTitle: "איך זה עובד",
    howItWorksDescription: "המחשבונים שלנו הופכים תכנון פיננסי מורכב לפשוט ונגיש.",
    step1Title: "הזן את הנתונים שלך",
    step1Description: "הזן את המידע הפיננסי והמטרות שלך למחשבונים ידידותיים למשתמש שלנו.",
    step2Title: "קבל ניתוח מיידי",
    step2Description: "הבינה המלאכותית שלנו מנתחת את הקלט שלך ומספקת תחזיות והמלצות מפורטות.",
    step3Title: "קבל החלטות טובות יותר",
    step3Description: "השתמש בתובנות שלנו כדי לייעל את האסטרטגיה הפיננסית שלך ולבנות עושר לטווח ארוך.",
    
    // Calculators Section
    calculatorsTitle: "המחשבונים הפיננסיים שלנו",
    calculatorsDescription: "כלים חזקים שיעזרו לך לקבל החלטות פיננסיות מושכלות.",
    portfolioLoanTitle: "מחשבון הלוואת תיק",
    portfolioLoanDescription: "השווה בין לקיחת הלוואה כנגד ההשקעות שלך לבין מכירת נכסים כדי לענות על צרכים פיננסיים מיידיים.",
    portfolioBenefit1: "הימנע מהשלכות מס פוטנציאליות ממכירת השקעות",
    portfolioBenefit2: "שמור על צמיחת תיק ההשקעות שלך תוך גישה להון",
    portfolioBenefit3: "צפה בהשפעות לטווח ארוך של אסטרטגיות שונות",
    pensionTitle: "מחשבון תכנון פנסיה",
    pensionDescription: "תכנן את הפרישה שלך בביטחון. מחשבון הפנסיה שלנו עוזר לך לקבוע כמה לחסוך היום כדי לעמוד ביעדי ההכנסה העתידיים שלך.",
    pensionBenefit1: "התאם משתנים כדי לראות כיצד הם משפיעים על מוכנות הפרישה שלך",
    pensionBenefit2: "התחשב באינפלציה וביצועי שוק",
    pensionBenefit3: "צפה בהכנסת הפרישה שלך שנה אחר שנה",
    compoundTitle: "מחשבון ריבית דריבית",
    compoundDescription: "ראה את כוחה של ריבית דריבית וכיצד ההשקעות שלך יכולות לצמוח לאורך זמן עם הפקדות קבועות.",
    compoundBenefit1: "צפה בצמיחה האקספוננציאלית של ההשקעות שלך",
    compoundBenefit2: "השווה אסטרטגיות השקעה שונות",
    compoundBenefit3: "הבן את ההשפעה של תדירות וסכום ההפקדות",
    taxTitle: "מחשבון יעילות מס",
    taxDescription: "ייעל את אסטרטגיית ההשקעה שלך ליעילות מס ומקסם את התשואות שלך אחרי מס.",
    taxBenefit1: "השווה השלכות מס של כלי השקעה שונים",
    taxBenefit2: "הבן כיצד חשבונות עם הטבות מס יכולים להגביר תשואות",
    taxBenefit3: "תכנן משיכות כדי למזער את נטל המס",
    realEstateTitle: "מחשבון השקעות נדל\"ן",
    realEstateDescription: "גלה את 3 מנועי הרווח בנדל\"ן: תזרים מזומנים, עליית ערך ובניית הון. צפה בתחזית העושר שלך ל-30 שנה.",
    realEstateBenefit1: "צפה בתזרים מזומנים חודשי וצמיחת שווי הנכס לאורך 30 שנה",
    realEstateBenefit2: "הבן את כוח המינוף ו-3 מנועי הרווח",
    realEstateBenefit3: "השווה תרחישים עם הון עצמי ומימון שונים",
    tryCalculator: "נסה את המחשבון",
    
    // Testimonials Section
    testimonialsTitle: "מה אומרים המשתמשים שלנו",
    testimonialsDescription: "שמע מאנשים ששינו את עתידם הפיננסי עם Invested AI.",
    testimonial1Content: "מחשבון הלוואת התיק עזר לי לקבל החלטה קריטית שחסכה לי אלפי דולרים במסים תוך שמירה על צמיחת ההשקעות שלי.",
    testimonial1Author: "שרה ג'ונסון",
    testimonial1Role: "בעלת עסק קטן",
    testimonial2Content: "סוף סוף אני מבין כמה אני צריך לחסוך לפרישה. מחשבון תכנון הפנסיה הבהיר זאת לחלוטין.",
    testimonial2Author: "מייקל צ'ן",
    testimonial2Role: "מהנדס תוכנה",
    testimonial3Content: "מחשבון הריבית דריבית הראה לי את הכוח האמיתי של התחלה מוקדמת. שיניתי לחלוטין את אסטרטגיית ההשקעה שלי.",
    testimonial3Author: "אמה רודריגז",
    testimonial3Role: "מנהלת שיווק",
    
    // CTA Section
    ctaTitle: "התחל לבנות את העתיד הפיננסי שלך היום",
    ctaDescription: "המחשבונים שלנו זמינים לשימוש בחינם, ללא צורך בהרשמה. עשה את הצעד הראשון לקראת חופש פיננסי.",
    tryOurCalculators: "נסה את המחשבונים שלנו",
  },
}; 