"use client";

import { RealEstateCalculator } from "@/components/calculators/RealEstateCalculator";
import { useTranslationStore } from "@/lib/translations";
import { useEffect } from "react";
import { Language } from "@/lib/translations";

export default function RealEstatePage({ params: { lang } }: { params: { lang: Language } }) {
  const { setLanguage } = useTranslationStore();

  useEffect(() => {
    setLanguage(lang);
  }, [lang, setLanguage]);

  return <RealEstateCalculator />;
}

