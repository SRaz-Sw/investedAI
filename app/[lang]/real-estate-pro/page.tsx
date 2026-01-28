/**
 * Real Estate Calculator Pro - Page Component
 *
 * Route: /[lang]/real-estate-pro
 */

'use client';

import { RealEstateCalculatorPro } from '@/components/calculators/realestate-pro';
import { useTranslationStore } from '@/lib/translations';
import { useEffect, use } from 'react';
import { Language } from '@/lib/translations';

export default function RealEstateProPage({
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

	return <RealEstateCalculatorPro />;
}
