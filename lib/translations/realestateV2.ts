/**
 * Real Estate Calculator V2 - Translations
 *
 * Hebrew and English translations for the new real estate calculator
 * following the "3 engines of profit" concept.
 */

import { Language } from './index';

export interface RealEstateV2Translation {
	// Page titles
	title: string;
	subtitle: string;

	// Input labels - Basic
	purchasePrice: string;
	belowMarket: string;
	monthlyRent: string;
	appreciation: string;
	rentGrowth: string;
	downPayment: string;

	// Input labels - Advanced
	advancedSettings: string;
	vacancyRate: string;
	insuranceTax: string;
	propertyManagement: string;
	maintenance: string;
	mortgageRate: string;
	mortgageTerm: string;

	// Help text for sliders
	purchasePrice_help: string;
	belowMarket_help: string;
	monthlyRent_help: string;
	appreciation_help: string;
	rentGrowth_help: string;
	downPayment_help: string;
	vacancyRate_help: string;
	insuranceTax_help: string;
	propertyManagement_help: string;
	maintenance_help: string;
	mortgageRate_help: string;
	mortgageTerm_help: string;

	// Derived values
	marketValue: string;
	instantEquity: string;
	loanAmount: string;
	monthlyMortgagePayment: string;

	// Three Engines
	threeEngines: string;
	threeEnginesDesc: string;
	engine1Title: string;
	engine1Desc: string;
	engine2Title: string;
	engine2Desc: string;
	engine3Title: string;
	engine3Desc: string;

	// Results Panel
	year1Results: string;
	withLeverage: string;
	withoutLeverage: string;
	netMonthly: string;
	annualCashFlow: string;
	appreciationGain: string;
	principalPaydown: string;
	totalReturn: string;
	roi: string;

	// Chart
	chartTitle: string;
	chartSubtitle: string;
	propertyValue: string;
	equity: string;
	mortgageBalance: string;
	rent: string;
	year: string;
	month: string;

	// Tooltip
	tooltipNetCashFlow: string;
	tooltipCumulative: string;
	tooltipEquityPercent: string;
	netWorth: string;

	// Storyline
	storylineIntro: string;
	storylineInvest: string;
	storylineAfter: string;
	storylineYears: string;
	storylineWorth: string;
	storylineTotalReturn: string;
	storylineROI: string;

	// Monthly Breakdown
	monthlyBreakdown: string;
	income: string;
	expenses: string;
	vacancy: string;
	insurance: string;
	management: string;
	maintenanceCost: string;
	mortgage: string;
	netCashFlow: string;

	// Share button
	shareCalculation: string;
	linkCopied: string;

	// Units & Formatting
	perMonth: string;
	perYear: string;
	years: string;
	close: string;
}

export const realEstateV2Translations: Record<
	Language,
	RealEstateV2Translation
> = {
	en: {
		// Page titles
		title: 'Real Estate Investment Calculator',
		subtitle:
			'Discover the 3 engines of profit: Cash Flow, Appreciation & Equity Building',

		// Input labels - Basic
		purchasePrice: 'Market Value',
		belowMarket: 'Below Market %',
		monthlyRent: 'Monthly Rent',
		appreciation: 'Annual Appreciation',
		rentGrowth: 'Rent Growth Rate',
		downPayment: 'Down Payment',

		// Input labels - Advanced
		advancedSettings: 'Advanced Settings',
		vacancyRate: 'Vacancy Rate',
		insuranceTax: 'Insurance + Tax',
		propertyManagement: 'Property Management',
		maintenance: 'Annual Maintenance',
		mortgageRate: 'Mortgage Rate',
		mortgageTerm: 'Mortgage Term',

		// Help text
		purchasePrice_help:
			"The property's market value. Your actual purchase price is reduced by the 'Below Market %'",
		belowMarket_help:
			'Your discount from market value. 30% below market on a $100K property = $70K purchase price',
		monthlyRent_help: 'Expected monthly rental income from tenants',
		appreciation_help:
			'Historical average in Indianapolis is ~4% per year',
		rentGrowth_help:
			'Rent typically increases 3% annually with inflation',
		downPayment_help:
			'Your initial cash investment. 25% = 75% leverage',
		vacancyRate_help:
			'Percentage of time the property sits empty between tenants',
		insuranceTax_help:
			'Monthly cost for property insurance and property taxes',
		propertyManagement_help:
			'Fee charged by property management company (% of rent)',
		maintenance_help:
			'Annual maintenance costs as % of property value',
		mortgageRate_help: 'Annual interest rate on your mortgage loan',
		mortgageTerm_help: 'Length of the mortgage in years',

		// Derived values
		marketValue: 'Market Value',
		instantEquity: 'Instant Equity',
		loanAmount: 'Loan Amount',
		monthlyMortgagePayment: 'Monthly Mortgage',

		// Three Engines
		threeEngines: 'The 3 Engines of Profit',
		threeEnginesDesc: 'Your Year 1 returns broken down by source',
		engine1Title: 'Cash Flow',
		engine1Desc: 'Monthly income after all expenses',
		engine2Title: 'Appreciation',
		engine2Desc: 'Property value growth',
		engine3Title: 'Principal Paydown',
		engine3Desc: 'Tenant pays your mortgage',

		// Results Panel
		year1Results: 'Year 1 Results',
		withLeverage: 'With Leverage',
		withoutLeverage: 'Without Leverage (All Cash)',
		netMonthly: 'Net Monthly',
		annualCashFlow: 'Annual Cash Flow',
		appreciationGain: 'Appreciation',
		principalPaydown: 'Principal Paydown',
		totalReturn: 'Total Return',
		roi: 'ROI',

		// Chart
		chartTitle: '30-Year Property Projection',
		chartSubtitle: 'Watch your wealth grow over time',
		propertyValue: 'Property Value',
		equity: 'Equity',
		mortgageBalance: 'Mortgage Balance',
		rent: 'Monthly Rent',
		year: 'Year',
		month: 'Month',

		// Tooltip
		tooltipNetCashFlow: 'Net Cash Flow',
		tooltipCumulative: 'Cumulative Cash Flow',
		tooltipEquityPercent: 'Ownership',
		netWorth: 'Net Worth',

		// Storyline
		storylineIntro: 'If you invest',
		storylineInvest: 'today',
		storylineAfter: 'after',
		storylineYears: 'years',
		storylineWorth: 'your property will be worth',
		storylineTotalReturn: 'with a total return of',
		storylineROI: "That's a",

		// Monthly Breakdown
		monthlyBreakdown: 'Monthly Breakdown (Year 1)',
		income: 'Income',
		expenses: 'Expenses',
		vacancy: 'Vacancy Loss',
		insurance: 'Insurance + Tax',
		management: 'Management Fee',
		maintenanceCost: 'Maintenance',
		mortgage: 'Mortgage P&I',
		netCashFlow: 'Net Cash Flow',

		// Share button
		shareCalculation: 'Share Calculation',
		linkCopied: 'Link Copied!',

		// Units
		perMonth: '/mo',
		perYear: '/yr',
		years: 'years',
		close: 'Close',
	},

	he: {
		// Page titles
		title: 'מחשבון השקעות נדל"ן',
		subtitle:
			'גלה את 3 מנועי הרווח: תזרים מזומנים, עליית ערך ובניית הון',

		// Input labels - Basic
		purchasePrice: 'שווי שוק',
		belowMarket: 'מתחת לשוק %',
		monthlyRent: 'שכירות חודשית',
		appreciation: 'עליית ערך שנתית',
		rentGrowth: 'עליית שכירות',
		downPayment: 'הון עצמי',

		// Input labels - Advanced
		advancedSettings: 'הגדרות מתקדמות',
		vacancyRate: 'זמן פנוי',
		insuranceTax: 'ביטוח + מיסים',
		propertyManagement: 'חברת ניהול',
		maintenance: 'תחזוקה שנתית',
		mortgageRate: 'ריבית משכנתא',
		mortgageTerm: 'תקופת משכנתא',

		// Help text
		purchasePrice_help:
			'שווי השוק של הנכס. מחיר הקנייה בפועל מחושב לפי ההנחה שתבחר',
		belowMarket_help:
			'ההנחה שלך משווי השוק. 30% מתחת לשוק על נכס של $100K = מחיר קנייה של $70K',
		monthlyRent_help: 'הכנסה חודשית צפויה משכירות',
		appreciation_help: 'הממוצע ההיסטורי באינדיאנפוליס הוא ~4% בשנה',
		rentGrowth_help: 'השכירות בדרך כלל עולה 3% בשנה עם האינפלציה',
		downPayment_help: 'ההשקעה הראשונית שלך במזומן. 25% = מינוף של 75%',
		vacancyRate_help: 'אחוז הזמן שהנכס עומד ריק בין דיירים',
		insuranceTax_help: 'עלות חודשית לביטוח נכס ומיסי נכס',
		propertyManagement_help: 'עמלה שגובה חברת ניהול (% מהשכירות)',
		maintenance_help: 'עלויות תחזוקה שנתיות כ-% משווי הנכס',
		mortgageRate_help: 'שיעור הריבית השנתי על הלוואת המשכנתא',
		mortgageTerm_help: 'אורך המשכנתא בשנים',

		// Derived values
		marketValue: 'שווי שוק',
		instantEquity: 'הון מיידי',
		loanAmount: 'סכום הלוואה',
		monthlyMortgagePayment: 'משכנתא חודשית',

		// Three Engines
		threeEngines: '3 מנועי הרווח',
		threeEnginesDesc: 'התשואות שלך בשנה 1 לפי מקור',
		engine1Title: 'תזרים מזומנים',
		engine1Desc: 'הכנסה חודשית אחרי כל ההוצאות',
		engine2Title: 'עליית ערך',
		engine2Desc: 'צמיחת שווי הנכס',
		engine3Title: 'פירעון קרן',
		engine3Desc: 'השוכר משלם את המשכנתא שלך',

		// Results Panel
		year1Results: 'תוצאות שנה 1',
		withLeverage: 'עם מינוף',
		withoutLeverage: 'בלי מינוף (כל מזומן)',
		netMonthly: 'נטו חודשי',
		annualCashFlow: 'תזרים שנתי',
		appreciationGain: 'עליית ערך',
		principalPaydown: 'פירעון קרן',
		totalReturn: 'תשואה כוללת',
		roi: 'תשואה על ההשקעה',

		// Chart
		chartTitle: 'תחזית 30 שנה',
		chartSubtitle: 'צפה בעושר שלך גדל לאורך זמן',
		propertyValue: 'שווי נכס',
		equity: 'הון עצמי',
		mortgageBalance: 'יתרת משכנתא',
		rent: 'שכירות חודשית',
		year: 'שנה',
		month: 'חודש',

		// Tooltip
		tooltipNetCashFlow: 'תזרים נטו',
		tooltipCumulative: 'תזרים מצטבר',
		tooltipEquityPercent: 'בעלות',
		netWorth: 'שווי נקי',

		// Storyline
		storylineIntro: 'אם תשקיע',
		storylineInvest: 'היום',
		storylineAfter: 'אחרי',
		storylineYears: 'שנים',
		storylineWorth: 'הנכס שלך יהיה שווה',
		storylineTotalReturn: 'עם תשואה כוללת של',
		storylineROI: 'זו תשואה של',

		// Monthly Breakdown
		monthlyBreakdown: 'פירוט חודשי (שנה 1)',
		income: 'הכנסה',
		expenses: 'הוצאות',
		vacancy: 'אובדן פנוי',
		insurance: 'ביטוח + מיסים',
		management: 'דמי ניהול',
		maintenanceCost: 'תחזוקה',
		mortgage: 'משכנתא',
		netCashFlow: 'תזרים נטו',

		// Share button
		shareCalculation: 'שתף חישוב',
		linkCopied: 'הקישור הועתק!',

		// Units
		perMonth: '/חודש',
		perYear: '/שנה',
		years: 'שנים',
		close: 'סגור',
	},
};
