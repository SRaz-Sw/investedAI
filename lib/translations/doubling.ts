import { Language } from './index';

export interface DoublingTranslation {
  title: string;
  subtitle: string;
  annualReturnRate: string;
  moneyWillDouble: string;
  years: string;
  presetSavingsAccount: string;
  presetBonds: string;
  presetSP500: string;
  presetAggressiveGrowth: string;
  ruleOf72Note: string;
  preciseTime: string;
}

export const doublingTranslations: Record<Language, DoublingTranslation> = {
  en: {
    title: "Money Doubling Calculator",
    subtitle: "Using the Rule of 72: Years to double ≈ 72 ÷ Interest Rate",
    annualReturnRate: "Annual Return Rate",
    moneyWillDouble: "Your money will double in",
    years: "years",
    presetSavingsAccount: "Savings Account",
    presetBonds: "Bonds",
    presetSP500: "S&P 500 Average",
    presetAggressiveGrowth: "Aggressive Growth",
    ruleOf72Note: "The Rule of 72 is an approximation. Actual doubling time = ln(2) / ln(1 + r) where r is the decimal rate.",
    preciseTime: "Precise doubling time is",
  },
  he: {
    title: "מחשבון הכפלת כסף",
    subtitle: "באמצעות כלל 72: שנים להכפלה ≈ 72 ÷ שיעור ריבית",
    annualReturnRate: "שיעור תשואה שנתי",
    moneyWillDouble: "הכסף שלך יוכפל תוך",
    years: "שנים",
    presetSavingsAccount: "חשבון חיסכון",
    presetBonds: "אג\"ח",
    presetSP500: "ממוצע S&P 500",
    presetAggressiveGrowth: "צמיחה אגרסיבית",
    ruleOf72Note: "כלל 72 הוא קירוב. זמן הכפלה מדויק = ln(2) / ln(1 + r) כאשר r הוא השיעור העשרוני.",
    preciseTime: "זמן הכפלה מדויק הוא",
  },
};
