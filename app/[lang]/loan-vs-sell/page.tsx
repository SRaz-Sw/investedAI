"use client";

import { Card, CardContent } from '@/components/ui/card';
import { useTranslationStore } from '@/lib/translations';
import { useEffect, use } from 'react';
import { Language } from '@/lib/translations';
// import PortfolioLoanCalculator from '@/components/calculators/PortfolioLoanCalculator_V2';
// import { PortfolioLoanCalculator } from '@/components/calculators/PortfolioLoanCalculator';
import { PortfolioLoanCalculator_V3 } from '@/components/calculators/PortfolioLoanCalculator_V3';

export default function CompoundPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: langParam } = use(params);
  const lang = langParam as Language;
  const { setLanguage } = useTranslationStore();

  useEffect(() => {
    setLanguage(lang);
  }, [lang, setLanguage]);

  return (
    <div className="mx-auto">
      <PortfolioLoanCalculator_V3 />
    </div>
  );
}
