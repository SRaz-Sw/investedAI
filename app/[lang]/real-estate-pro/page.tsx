/**
 * Real Estate Calculator Pro - Page Component
 *
 * Route: /[lang]/real-estate-pro
 */

'use client';

import { RealEstateCalculatorPro } from '@/components/calculators/realestate-pro';
import { useTranslationStore } from '@/lib/translations';
import { useEffect } from 'react';
import { Language } from '@/lib/translations';

export default function RealEstateProPage({
	params: { lang },
}: {
	params: { lang: Language };
}) {
	const { setLanguage } = useTranslationStore();

	useEffect(() => {
		setLanguage(lang);
	}, [lang, setLanguage]);

	return <RealEstateCalculatorPro />;
}
