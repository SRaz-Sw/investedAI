/**
 * Real Estate Calculator V2 - Main Component
 *
 * This is the main container component that orchestrates all the pieces:
 * - State management
 * - Calculations
 * - URL state
 * - UI components
 *
 * Clean architecture with separation of concerns.
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2 } from 'lucide-react';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { useTranslationStore } from '@/lib/translations';
import { realEstateV2Translations } from '@/lib/translations/realestateV2';
import { useCurrencyFormatter } from '@/lib/hooks/useCurrencyFormatter';

// Local imports
import type { RealEstateInputs } from './types';
import { DEFAULT_INPUTS } from './types';
import { useCalculations } from './hooks/useCalculations';
import { useUrlState, useDebouncedValue } from './hooks/useUrlState';
import { getSliderConfigs } from './utils/sliderConfigs';
import { InputPanel } from './components/InputPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { ProjectionChart } from './components/ProjectionChart';
import { ShareButton } from './components/ShareButton';

export function RealEstateCalculatorV2() {
	const { language, direction } = useTranslationStore();
	const { formatCurrencySafe } = useCurrencyFormatter();
	const t = realEstateV2Translations[language];

	// URL state management
	const { initialInputs, updateUrl, copyShareUrl } = useUrlState();

	// Local state
	const [mounted, setMounted] = useState(false);
	const [inputs, setInputs] = useState<RealEstateInputs>(initialInputs);
	const [advancedOpen, setAdvancedOpen] = useState(false);
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [drawerContent, setDrawerContent] = useState({
		title: '',
		description: '',
	});

	// Debounce inputs for URL updates (avoid too many history updates)
	const debouncedInputs = useDebouncedValue(inputs, 300);

	// Update URL when inputs change (debounced)
	useEffect(() => {
		if (mounted) {
			updateUrl(debouncedInputs);
		}
	}, [debouncedInputs, updateUrl, mounted]);

	// Mount effect
	useEffect(() => {
		setMounted(true);
	}, []);

	// Calculate all derived values and projections
	const { derived, projection, chartDisplayData } =
		useCalculations(inputs);

	// Slider configurations
	const sliderConfigs = getSliderConfigs(t);

	// Input change handler
	const handleInputChange = <K extends keyof RealEstateInputs>(
		key: K,
		value: number
	) => {
		setInputs((prev) => ({ ...prev, [key]: value }));
	};

	// Help drawer handler
	const openHelpDrawer = (title: string, description: string) => {
		setDrawerContent({ title, description });
		setDrawerOpen(true);
	};

	if (!mounted) return null;

	return (
		<div
			className="font-sans p-4 md:p-8 min-h-screen flex flex-col justify-center items-center"
			dir={direction()}
		>
			<Card className="w-full max-w-7xl overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-zinc-900/70 rounded-3xl mb-8">
				<div className="absolute inset-0 bg-gradient-to-tr from-zinc-100/30 via-transparent to-emerald-100/30 dark:from-zinc-900/20 dark:to-emerald-900/20 rounded-3xl"></div>

				<CardContent className="space-y-6 md:space-y-8 p-4 md:p-8 relative z-10">
					{/* ===== HEADER ===== */}
					<div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
						<div className="text-center md:text-start space-y-2">
							<div className="flex items-center justify-center md:justify-start gap-3">
								<Building2 className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
								<h1 className="text-3xl font-light tracking-tight bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent">
									{t.title}
								</h1>
							</div>
							<p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl">
								{t.subtitle}
							</p>
						</div>
						<ShareButton
							inputs={inputs}
							copyShareUrl={copyShareUrl}
							translations={t}
						/>
					</div>

					{/* ===== STORYLINE TEXT ===== */}
					<Card className="bg-gradient-to-r from-emerald-50/60 to-sky-50/60 dark:from-emerald-950/30 dark:to-sky-950/30 border border-emerald-200/30 dark:border-emerald-800/20">
						<CardContent className="p-4">
							<p className="text-center text-gray-700 dark:text-gray-300 leading-relaxed">
								{t.storylineIntro}{' '}
								<span className="font-bold text-emerald-600 dark:text-emerald-400">
									{formatCurrencySafe(
										derived.downPayment
									)}
								</span>{' '}
								{t.storylineInvest}, {t.storylineAfter}{' '}
								<span className="font-bold text-sky-600 dark:text-sky-400">
									{inputs.mortgageTermYears}{' '}
									{t.storylineYears}
								</span>{' '}
								{t.storylineWorth}{' '}
								<span className="font-bold text-violet-600 dark:text-violet-400">
									{formatCurrencySafe(
										Math.round(
											projection.summary.year30
												.netWorth
										)
									)}
								</span>
								. {t.storylineROI}{' '}
								<span className="font-bold text-2xl text-emerald-600 dark:text-emerald-400">
									{projection.summary.year1.withLeverage.roi.toFixed(
										1
									)}
									%
								</span>{' '}
								{t.roi}!
							</p>
						</CardContent>
					</Card>

					{/* ===== INPUT PANEL ===== */}
					<InputPanel
						inputs={inputs}
						onInputChange={handleInputChange}
						sliderConfigs={sliderConfigs}
						translations={t}
						advancedOpen={advancedOpen}
						onAdvancedToggle={setAdvancedOpen}
						onHelpClick={openHelpDrawer}
						formatCurrency={formatCurrencySafe}
					/>

					{/* ===== PROJECTION CHART ===== */}
					<Card className="overflow-hidden border border-white/20 dark:border-white/10 shadow-lg backdrop-blur-md bg-white/90 dark:bg-zinc-900/80 rounded-2xl">
						<CardContent className="p-4 md:p-6">
							<div className="mb-4">
								<h3 className="text-lg font-semibold bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
									{t.chartTitle}
								</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{t.chartSubtitle}
								</p>
							</div>
							<ProjectionChart
								data={chartDisplayData}
								mortgageTermYears={
									inputs.mortgageTermYears
								}
								language={language}
								translations={t}
							/>
						</CardContent>
					</Card>

					{/* ===== DERIVED VALUES SUMMARY ===== */}
					<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
						<Card className="bg-gradient-to-br from-white/70 to-zinc-50/70 dark:from-zinc-800/70 dark:to-zinc-900/50 backdrop-blur-md border border-white/50 dark:border-zinc-700/30">
							<CardContent className="p-4">
								<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
									{t.marketValue}
								</p>
								<p className="text-lg font-bold text-gray-900 dark:text-gray-100">
									{formatCurrencySafe(
										Math.round(derived.marketValue)
									)}
								</p>
							</CardContent>
						</Card>

						<Card className="bg-gradient-to-br from-white/70 to-zinc-50/70 dark:from-zinc-800/70 dark:to-zinc-900/50 backdrop-blur-md border border-white/50 dark:border-zinc-700/30">
							<CardContent className="p-4">
								<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
									{t.instantEquity}
								</p>
								<p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
									{formatCurrencySafe(
										Math.round(derived.instantEquity)
									)}
								</p>
							</CardContent>
						</Card>

						<Card className="bg-gradient-to-br from-white/70 to-zinc-50/70 dark:from-zinc-800/70 dark:to-zinc-900/50 backdrop-blur-md border border-white/50 dark:border-zinc-700/30">
							<CardContent className="p-4">
								<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
									{t.loanAmount}
								</p>
								<p className="text-lg font-bold text-gray-900 dark:text-gray-100">
									{formatCurrencySafe(
										Math.round(derived.loanAmount)
									)}
								</p>
							</CardContent>
						</Card>

						<Card className="bg-gradient-to-br from-white/70 to-zinc-50/70 dark:from-zinc-800/70 dark:to-zinc-900/50 backdrop-blur-md border border-white/50 dark:border-zinc-700/30">
							<CardContent className="p-4">
								<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
									{t.monthlyMortgagePayment}
								</p>
								<p className="text-lg font-bold text-gray-900 dark:text-gray-100">
									{formatCurrencySafe(
										Math.round(derived.monthlyMortgage)
									)}
									{t.perMonth}
								</p>
							</CardContent>
						</Card>
					</div>
					{/* ===== RESULTS PANEL ===== */}
					<ResultsPanel
						year1={projection.summary.year1}
						derived={derived}
						translations={t}
						formatCurrency={formatCurrencySafe}
					/>
				</CardContent>
			</Card>

			{/* ===== HELP DRAWER ===== */}
			<Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>{drawerContent.title}</DrawerTitle>
						<DrawerDescription>
							{drawerContent.description}
						</DrawerDescription>
					</DrawerHeader>
					<DrawerFooter>
						<DrawerClose asChild>
							<Button variant="outline">{t.close}</Button>
						</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</div>
	);
}
