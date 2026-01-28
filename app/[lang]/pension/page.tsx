"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PensionPlanningCalculator } from "@/components/calculators/PensionPlanningCalculator";
import { useTranslationStore } from "@/lib/translations";
import { useEffect, use } from "react";
import { Language } from "@/lib/translations";
import { pensionTranslations } from "@/lib/translations/pension";

export default function PensionPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = use(params);
  const lang = langParam as Language;
  const { setLanguage } = useTranslationStore();
  const t = pensionTranslations[lang];

  useEffect(() => {
    setLanguage(lang);
  }, [lang, setLanguage]);

  return (
    // <div className="container mx-auto py-8 px-4">
    //   <div className="max-w-5xl mx-auto space-y-8">
    //     <div className="text-center space-y-4">
    //       <h1 className="text-4xl font-bold tracking-tight">{t.title}</h1>
    //       <p className="text-muted-foreground max-w-2xl mx-auto">
    //         {t.subtitle}
    //       </p>
    //     </div>

    //     <Card>
    //       <CardContent className="pt-6">
    //         <PensionPlanningCalculator />
    //       </CardContent>
    //     </Card>
    //   </div>
    // </div>
    <PensionPlanningCalculator />

  );
}