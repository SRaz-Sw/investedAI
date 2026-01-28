"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TaxEfficiencyCalculator } from "@/components/calculators/TaxEfficiencyCalculator";
import { useTranslationStore } from "@/lib/translations";
import { useEffect, use } from "react";
import type { Language } from "@/lib/translations";

export default function TaxPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = use(params);
  const lang = langParam as Language;
  const { setLanguage } = useTranslationStore();

  useEffect(() => {
    setLanguage(lang);
  }, [lang, setLanguage]);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Tax Efficiency Calculator</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Compare different investment account types and understand their tax implications on your long-term returns.
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <TaxEfficiencyCalculator />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}