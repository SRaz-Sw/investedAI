/**
 * Real Estate Calculator Pro - Main Component
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

import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Archive, Save, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
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
import { realEstateProTranslations } from '@/lib/translations/realestatePro';
import { useCurrencyFormatter } from '@/lib/hooks/useCurrencyFormatter';

// Local imports
import type { RealEstateInputs } from './types';
import { DEFAULT_INPUTS } from './types';
import { useCalculations } from './hooks/useCalculations';
import { useSelectedYearStore } from '@/lib/stores/selectedYearStore';
import { calculateYearNResults, calculateExitAnalysis } from './utils/calculations';
import { useUrlState, useDebouncedValue } from './hooks/useUrlState';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getSliderConfigs } from './utils/sliderConfigs';
import { InputPanel } from './components/InputPanel';
import { ResultsPanel } from './components/ResultsPanel';
import { ProjectionChart } from './components/ProjectionChart';
import { WealthChart } from './components/WealthChart';
import { ShareButton } from './components/ShareButton';
import { ExportButton } from '@/components/calculators/ExportButton';
import { SavedPropertiesSidebar } from './components/SavedPropertiesSidebar';
import { SavePropertyDialog } from './components/SavePropertyDialog';
import { ExitSummaryPanel } from './components/ExitSummaryPanel';

export function RealEstateCalculatorPro() {
	const { language, direction } = useTranslationStore();
	const { formatCurrencySafe } = useCurrencyFormatter();
	const t = realEstateProTranslations[language];

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

	// Saved properties state with persistent storage
	// Default to true only for desktop, false for mobile
	const [sidebarOpen, setSidebarOpen] = useLocalStorage(
		'realestate-sidebar-open',
		typeof window !== 'undefined' && window.innerWidth >= 1024
	);
	const [saveDialogOpen, setSaveDialogOpen] = useState(false);

	// Responsive state - detect desktop vs mobile
	const [isDesktop, setIsDesktop] = useState(
		typeof window !== 'undefined' && window.innerWidth >= 1024
	);

	// Detect screen size for responsive behavior
	useEffect(() => {
		const checkIsDesktop = () => {
			const desktop = window.innerWidth >= 1024; // lg breakpoint
			setIsDesktop(desktop);

			// Auto-close sidebar when switching from desktop to mobile
			if (!desktop && sidebarOpen) {
				setSidebarOpen(false);
			}
		};

		checkIsDesktop();
		window.addEventListener('resize', checkIsDesktop);

		return () => window.removeEventListener('resize', checkIsDesktop);
	}, [sidebarOpen, setSidebarOpen]);

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

	// Selected year for "3 Engines" drill-down
	const { selectedYear, setSelectedYear } = useSelectedYearStore();
	const yearNData = useMemo(() => {
		if (!selectedYear || selectedYear <= 1) return null;
		return calculateYearNResults(inputs, derived, selectedYear);
	}, [selectedYear, inputs, derived]);

	// Exit analysis — defaults to full mortgage term when no year is selected
	const exitAnalysis = useMemo(() => {
		const exitYear = selectedYear && selectedYear > 0 ? selectedYear : inputs.mortgageTermYears;
		return calculateExitAnalysis(inputs, derived, projection, exitYear);
	}, [selectedYear, inputs, derived, projection]);

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

	// Load property handler
	const handleLoadProperty = (loadedInputs: RealEstateInputs) => {
		setInputs(loadedInputs);
	};

	// Toggle sidebar handler
	const handleToggleSidebar = () => {
		setSidebarOpen(!sidebarOpen);
	};

	// Handle successful save - open sidebar to show the new entry
	const handleSaveSuccess = () => {
		setSidebarOpen(true);
	};

	if (!mounted) return null;

	return (
		<div
			className="font-sans p-4 md:p-8 min-h-screen flex flex-col justify-center items-center"
			dir={direction()}
			style={{
				marginLeft: isDesktop && sidebarOpen ? '320px' : '0',
				transition: 'margin-left 300ms ease-in-out',
			}}
		>
			{/* Sidebar Toggle Button (Desktop only) */}
			{isDesktop && (
				<Button
					variant="outline"
					size="sm"
					onClick={handleToggleSidebar}
					className="fixed left-4 top-4 z-50 shadow-md"
					style={{
						marginLeft: sidebarOpen ? '320px' : '0',
						transition: 'margin-left 300ms ease-in-out',
					}}
				>
					{sidebarOpen ? (
						<>
							<PanelLeftClose className="h-4 w-4 mr-2" />
							Hide Sidebar
						</>
					) : (
						<>
							<PanelLeftOpen className="h-4 w-4 mr-2" />
							Show Sidebar
						</>
					)}
				</Button>
			)}

			<Card className="w-full max-w-7xl xl:max-w-full overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-zinc-900/70 rounded-3xl mb-8">
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
						<div className="flex flex-wrap gap-2 justify-center">
							{/* Only show Saved Properties button on mobile */}
							{!isDesktop && (
								<Button
									variant="outline"
									size="default"
									onClick={() => setSidebarOpen(true)}
								>
									<Archive className="h-4 w-4 mr-2" />
									Saved Properties
								</Button>
							)}
							<Button
								variant="default"
								size="default"
								onClick={() => setSaveDialogOpen(true)}
							>
								<Save className="h-4 w-4 mr-2" />
								Save
							</Button>
							<ExportButton
								inputs={{
									propertyValue: inputs.purchasePrice,
									belowMarketPercent: inputs.belowMarketPercent,
									downPaymentPercent: inputs.downPaymentPercent,
									closingCosts: inputs.closingCosts,
									monthlyRent: inputs.monthlyRent,
									appreciation: inputs.appreciationRate,
									mortgageRate: inputs.mortgageRate,
									mortgageTerm: inputs.mortgageTermYears,
									rentGrowth: inputs.rentGrowthRate,
									operatingCostsPercent: (inputs.insuranceTaxMonthly * 12 +
										inputs.purchasePrice * inputs.maintenancePercent / 100) /
										inputs.purchasePrice * 100,
								}}
								translations={{
									exportToExcel: t.exportToExcel,
									downloading: t.downloading,
									downloadComplete: t.downloadComplete,
								}}
								language={language}
							/>
							<ShareButton
								inputs={inputs}
								copyShareUrl={copyShareUrl}
								translations={t}
							/>
						</div>
					</div>

					{/* ===== STORYLINE TEXT ===== */}
					<Card className="bg-gradient-to-r from-emerald-50/60 to-sky-50/60 dark:from-emerald-950/30 dark:to-sky-950/30 border border-emerald-200/30 dark:border-emerald-800/20">
						<CardContent className="p-4">
							<p className="text-center text-gray-700 dark:text-gray-300 leading-relaxed">
								{t.storylineIntro}{' '}
								<span className="font-bold text-emerald-600 dark:text-emerald-400">
									{formatCurrencySafe(
										derived.totalCashRequired
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
								.
							</p>
							<div className="flex flex-wrap justify-center gap-4 mt-3 pt-3 border-t border-emerald-200/40 dark:border-emerald-700/40">
								<div className="text-center">
									<span className="text-sm text-gray-500 dark:text-gray-400">
										{t.storylineYear1ROI}
									</span>{' '}
									<span className="font-bold text-lg text-emerald-600 dark:text-emerald-400">
										{projection.summary.year1.withLeverage.roi.toFixed(
											1
										)}
										%
									</span>
								</div>
								<div className="text-center">
									<span className="text-sm text-gray-500 dark:text-gray-400">
										{t.storylineAverageROI}
									</span>{' '}
									<span className="font-bold text-lg text-sky-600 dark:text-sky-400">
										{projection.summary.averageAnnualROI.toFixed(
											1
										)}
										%
									</span>
								</div>
								<div className="text-center">
									<span className="text-sm text-gray-500 dark:text-gray-400">
										{t.storylineCompoundROI}
									</span>{' '}
									<span className="font-bold text-xl text-violet-600 dark:text-violet-400">
										{projection.summary.compoundAnnualROI.toFixed(
											1
										)}
										%
									</span>
								</div>
							</div>
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
									{inputs.mortgageTermYears}-{t.year}{' '}
									{t.chartTitle}
								</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									{t.chartSubtitle}{' '}
									{inputs.mortgageTermYears} {t.years}
								</p>
							</div>
							<ProjectionChart
								data={chartDisplayData}
								mortgageTermYears={
									inputs.mortgageTermYears
								}
								language={language}
								translations={t}
								cashFlowReinvestmentRate={inputs.cashFlowReinvestmentRate}
							/>
						</CardContent>
					</Card>

					{/* ===== DERIVED VALUES SUMMARY ===== */}
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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

						<Card className="bg-gradient-to-br from-emerald-50/70 to-emerald-100/50 dark:from-emerald-900/30 dark:to-emerald-800/20 backdrop-blur-md border border-emerald-200/50 dark:border-emerald-700/30">
							<CardContent className="p-4">
								<p className="text-xs text-emerald-700 dark:text-emerald-300 mb-1">
									{t.totalCashRequired}
								</p>
								<p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
									{formatCurrencySafe(
										Math.round(
											derived.totalCashRequired
										)
									)}
								</p>
							</CardContent>
						</Card>

						<Card className="bg-gradient-to-br from-white/70 to-zinc-50/70 dark:from-zinc-800/70 dark:to-zinc-900/50 backdrop-blur-md border border-white/50 dark:border-zinc-700/30">
							<CardContent className="p-4">
								<p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
									{t.instantEquity}
								</p>
								<p className="text-lg font-bold text-sky-600 dark:text-sky-400">
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
						selectedYear={selectedYear}
						yearNData={yearNData}
						onResetYear={() => setSelectedYear(null)}
					/>

					{/* ===== EXIT SUMMARY ===== */}
					<ExitSummaryPanel
						exitAnalysis={exitAnalysis}
						formatCurrency={formatCurrencySafe}
						translations={t}
						selectedYear={selectedYear}
						onResetYear={() => setSelectedYear(null)}
						mortgageTermYears={inputs.mortgageTermYears}
					/>

					{/* ===== WEALTH BUILDING CHART ===== */}
					<Card className="overflow-hidden border border-white/20 dark:border-white/10 shadow-lg backdrop-blur-md bg-white/90 dark:bg-zinc-900/80 rounded-2xl">
						<CardContent className="p-4 md:p-6">
							<h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
								{t.wealthOverTime}
							</h3>
							<WealthChart
								data={projection.chartData}
								mortgageTermYears={inputs.mortgageTermYears}
								language={language}
								translations={t}
								initialMarketValue={derived.marketValue}
								loanAmount={derived.loanAmount}
								downPayment={derived.downPayment}
								cashFlowReinvestmentRate={inputs.cashFlowReinvestmentRate}
							/>
						</CardContent>
					</Card>
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

			{/* ===== SAVED PROPERTIES SIDEBAR ===== */}
			<SavedPropertiesSidebar
				open={sidebarOpen}
				onOpenChange={setSidebarOpen}
				onLoadProperty={handleLoadProperty}
				currentInputs={inputs}
				mode={isDesktop ? 'fixed' : 'overlay'}
				onToggleCollapse={handleToggleSidebar}
				isCollapsed={!sidebarOpen}
			/>

			{/* ===== SAVE PROPERTY DIALOG ===== */}
			<SavePropertyDialog
				open={saveDialogOpen}
				onOpenChange={setSaveDialogOpen}
				inputs={inputs}
				onSaveSuccess={handleSaveSuccess}
			/>
		</div>
	);
}
