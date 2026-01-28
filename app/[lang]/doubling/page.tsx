"use client";

import { DoublingCalculator } from "@/components/calculators/DoublingCalculator";
import { useTranslationStore } from "@/lib/translations";
import { useEffect, use } from "react";
import { Language } from "@/lib/translations";

export default function DoublingPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang: langParam } = use(params);
  const lang = langParam as Language;
  const { setLanguage } = useTranslationStore();

  useEffect(() => {
    setLanguage(lang);
  }, [lang, setLanguage]);

  return <DoublingCalculator />;
}
