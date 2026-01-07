/**
 * Real Estate Calculator V2 - Page Component
 *
 * Route: /[lang]/realestate2
 */

'use client';

import { RealEstateCalculatorV2 } from '@/components/calculators/realestate-v2';
import { useTranslationStore } from '@/lib/translations';
import { useEffect } from 'react';
import { Language } from '@/lib/translations';

export default function RealEstateV2Page({
	params: { lang },
}: {
	params: { lang: Language };
}) {
	const { setLanguage } = useTranslationStore();

	useEffect(() => {
		setLanguage(lang);
	}, [lang, setLanguage]);

	return <RealEstateCalculatorV2 />;
}
