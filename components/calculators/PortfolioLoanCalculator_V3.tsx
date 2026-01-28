'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Info, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@/components/ui/drawer';
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip as RechartsTooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import { useTranslationStore } from '@/lib/translations';
import { portfolioV3Translations } from '@/lib/translations/portfolioV3';
import { useCurrencyFormatter } from '@/lib/hooks/useCurrencyFormatter';

// Add these type definitions at the top of the file
type RefNames = 'profitPercentage' | 'taxRate' | 'currentValue' | 'targetCash';
type SliderInfoKeys =
	| 'marketReturn'
	| 'interestRate'
	| 'currentValue'
	| 'targetCash'
	| 'years'
	| 'taxRate'
	| 'profitPercentage';

interface Inputs {
	initialInvestment: number;
	currentValue: number;
	targetCash: number;
	taxRate: number;
	interestRate: number;
	marketReturn: number;
	years: number;
	profitPercentage: number;
}

interface DrawerContent {
	title: string;
	description: string;
}

interface ChartData {
	year: number;
	loanStrategy: number;
	sellStrategy: number;
	loanBalance: number;
	yearlyInterest: number;
	totalInterestPaid: number;
	monthlyPayment: number;
	netWorth: number;
}

interface CalculationSummary {
	amountToSell: number;
	taxPaid: number;
	yearlyInterest: number;
	totalLoanNeeded: number;
	totalInterest: number;
}

interface ClickableValueProps {
	value: number;
	refName: RefNames;
	formatter?: (value: number) => string;
}

interface HelpButtonProps {
	sliderKey: SliderInfoKeys;
}

const PortfolioTaxCalculator: React.FC = () => {
	// Add translation hooks
	const { language, direction } = useTranslationStore();
	const { formatCurrencySafe, abbreviateNumber } = useCurrencyFormatter();
	const t = portfolioV3Translations[language];
	const [mounted, setMounted] = useState(false);
	const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768);

	useEffect(() => {
		setMounted(true);
		const handleResize = () => setWindowWidth(window.innerWidth);
		window.addEventListener('resize', handleResize);
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const [showDetails, setShowDetails] = useState(false);
	const [loanStrategy, setLoanStrategy] = useState('monthly');
	const [drawerOpen, setDrawerOpen] = useState(false);
	const [drawerContent, setDrawerContent] = useState({
		title: '',
		description: '',
	});
	const [inputs, setInputs] = useState({
		initialInvestment: 100000,
		currentValue: 200000,
		targetCash: 100000,
		taxRate: 25,
		interestRate: 5,
		marketReturn: 10,
		years: 5,
		profitPercentage: 75,
	});
	const [animatingRef, setAnimatingRef] = useState<RefNames | null>(null);

	// References for scrolling
	const profitPercentageRef = useRef<HTMLDivElement>(null);
	const taxRateRef = useRef<HTMLDivElement>(null);
	const portfolioValueRef = useRef<HTMLDivElement>(null);
	const targetCashRef = useRef<HTMLDivElement>(null);

	// Define refs object outside of handleValueClick
	const refs = {
		profitPercentage: profitPercentageRef,
		taxRate: taxRateRef,
		currentValue: portfolioValueRef,
		targetCash: targetCashRef,
	} as const;

	// Update handleValueClick
	const handleValueClick = (refName: RefNames): void => {
		setShowDetails(true);
		setAnimatingRef(refName);

		setTimeout(() => {
			if (refs[refName]?.current) {
				refs[refName].current?.scrollIntoView({ behavior: 'smooth' });
			}
		}, 100);

		setTimeout(() => {
			setAnimatingRef(null);
		}, 1500);
	};

	// Helper functions for opening the info drawer
	const openInfoDrawer = (title: string, description: string): void => {
		setDrawerContent({
			title,
			description,
		});
		setDrawerOpen(true);
	};

	// Info descriptions for each slider
	const sliderInfo: Record<SliderInfoKeys, { title: string; description: string }> = {
		marketReturn: {
			title: t.marketReturn,
			description: t.marketReturnDesc,
		},
		interestRate: {
			title: t.interestRate_2,
			description: t.interestRateDesc,
		},
		currentValue: {
			title: t.currentValue,
			description: t.currentValueDesc,
		},
		targetCash: {
			title: t.targetCash_2,
			description: t.targetCashDesc,
		},
		years: {
			title: t.years_2,
			description: t.yearsDesc,
		},
		taxRate: {
			title: t.taxRate_2,
			description: t.taxRateDesc,
		},
		profitPercentage: {
			title: t.profitPercentage_2,
			description: t.profitPercentageDesc,
		},
	};

	const formulas = {
		upfrontLoan: 'Upfront Loan = Target Cash / (1 - (interest_rate * years))',
		monthlyPayment: 'Monthly Interest = (Loan Amount * interest_rate) / 12',
		requiredLoan: 'Required Loan = Target Cash / (1 - (interest_rate * years))',
		amountToSell: 'Amount to Sell = Target Cash / (1 - (profit_percentage * tax_rate))',
		portfolioGrowth: 'Portfolio(year) = Portfolio(year-1) * (1 + market_return) - yearly_interest',
	};

	const calculateRequiredLoan = (principal: number, rate: number, years: number): number => {
		const annualRate = rate / 100;
		if (annualRate * years >= 1) return principal * 2;
		return principal / (1 - annualRate * years);
	};

	const calculateUpfrontLoan = (targetCash: number, rate: number, years: number): number => {
		const annualRate = rate / 100;
		if (annualRate * years >= 1) return targetCash * 2;
		return targetCash / (1 - annualRate * years);
	};

	const calculateMonthlyInterest = (loanAmount: number, rate: number): number => {
		return (loanAmount * (rate / 100)) / 12;
	};

	const calculateValues = () => {
		const data = [];
		const taxPerDollarSold = (inputs.profitPercentage / 100) * (inputs.taxRate / 100);

		const amountToSell = inputs.targetCash / (1 - taxPerDollarSold);
		const taxPaid = amountToSell * taxPerDollarSold;
		let sellPortfolioValue = inputs.currentValue - amountToSell;

		let totalLoanNeeded,
			yearlyInterest,
			monthlyInterest,
			accumulatedInterest = 0;
		let loanPortfolioValue = inputs.currentValue;

		totalLoanNeeded = inputs.targetCash;
		yearlyInterest = totalLoanNeeded * (inputs.interestRate / 100);
		monthlyInterest = calculateMonthlyInterest(totalLoanNeeded, inputs.interestRate);

		if (loanStrategy === 'upfront') {
			totalLoanNeeded = calculateUpfrontLoan(inputs.targetCash, inputs.interestRate, inputs.years);
			accumulatedInterest = totalLoanNeeded - inputs.targetCash;
		}

		for (let year = 0; year <= inputs.years; year++) {
			if (year > 0) {
				sellPortfolioValue = sellPortfolioValue * (1 + inputs.marketReturn / 100);
				if (loanStrategy === 'upfront') {
					loanPortfolioValue = loanPortfolioValue * (1 + inputs.marketReturn / 100);
				} else {
					let monthlyPortfolioValue = loanPortfolioValue;
					const monthlyReturn = inputs.marketReturn / 1200;

					for (let month = 0; month < 12; month++) {
						monthlyPortfolioValue = monthlyPortfolioValue * (1 + monthlyReturn) - monthlyInterest;
						accumulatedInterest += monthlyInterest;
					}
					loanPortfolioValue = monthlyPortfolioValue;
				}
			}

			data.push({
				year,
				loanStrategy: Math.round(loanPortfolioValue),
				sellStrategy: Math.round(sellPortfolioValue),
				loanBalance: totalLoanNeeded,
				yearlyInterest: Math.round(yearlyInterest),
				totalInterestPaid: Math.round(accumulatedInterest),
				monthlyPayment: loanStrategy === 'monthly' ? Math.round(monthlyInterest) : 0,
				netWorth: Math.round(loanPortfolioValue - totalLoanNeeded),
			});
		}

		return {
			data,
			summary: {
				amountToSell,
				taxPaid,
				yearlyInterest,
				totalLoanNeeded,
				totalInterest: totalLoanNeeded - inputs.targetCash,
			},
		};
	};

	const { data, summary } = calculateValues();
	const finalYear = data[data.length - 1];

	// Update ClickableValue component
	const ClickableValue: React.FC<ClickableValueProps> = ({
		value,
		refName,
		formatter = (v: number) => v.toString(),
	}) => (
		<span
			onClick={() => handleValueClick(refName)}
			className="underline decoration-dotted cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-medium"
		>
			{formatter(value)}
		</span>
	);

	// Update HelpButton component
	const HelpButton: React.FC<HelpButtonProps> = ({ sliderKey }) => (
		<Button
			variant="ghost"
			size="icon"
			className="h-5 w-5 rounded-full bg-transparent hover:bg-white/30  dark:hover:bg-black/30 transition-all shadow-sm backdrop-blur-sm p-0"
			onClick={(e) => {
				e.stopPropagation();
				openInfoDrawer(sliderInfo[sliderKey].title, sliderInfo[sliderKey].description);
			}}
		>
			<HelpCircle className="h-3.5 w-3.5 text-emerald-700/90 dark:text-emerald-400/90 transition-colors" />
		</Button>
	);

	return (
		<div
			className={`font-sans p-4 md:p-8  flex flex-col justify-center items-center`} 
		>
			<Card className="w-full max-w-7xl overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-zinc-900/70 rounded-3xl mb-8">
				<div className="absolute inset-0 bg-gradient-to-tr from-zinc-100/30 via-transparent to-emerald-100/30 dark:from-zinc-900/20 dark:to-emerald-900/20 rounded-3xl"></div>
				<CardContent className="space-y-8 p-8 relative z-10">
					{/* Header */}
					<div className="text-center space-y-3 mb-10">
						<h1 className="text-3xl font-light tracking-tight bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent">
							{t.portfolioTaxStrategy}
						</h1>
						<p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">{t.compareOutcomes}</p>
					</div>

					{/* Explanatory section */}
					<div className="p-6 backdrop-blur-md bg-gradient-to-r from-zinc-50/90 to-zinc-100/90 dark:from-zinc-950/60 dark:to-zinc-900/60 rounded-2xl border border-zinc-200/50 dark:border-zinc-800/30 shadow-lg">
						<p className="text-sm leading-relaxed text-gray-800 dark:text-gray-200">
							{t.ifYouHave}{' '}
							<ClickableValue
								value={inputs.currentValue}
								refName="currentValue"
								formatter={(v) => formatCurrencySafe(Number(v))}
							/>
							,{t.with}{' '}
							<ClickableValue
								value={inputs.profitPercentage}
								refName="profitPercentage"
								formatter={(v) => v + '%'}
							/>{' '}
							{t.inProfits}
							{t.andTaxRate}{' '}
							<ClickableValue value={inputs.taxRate} refName="taxRate" formatter={(v) => v + '%'} />{' '}
							{t.taxRateOn}
							{t.andYouNeed}{' '}
							<ClickableValue
								value={inputs.targetCash}
								refName="targetCash"
								formatter={(v) => formatCurrencySafe(Number(v))}
							/>{' '}
							{t.inCash}
						</p>
						<div className="mt-4 grid grid-cols-2 gap-8 text-sm">
							<div className="flex flex-col space-y-2 items-center p-4 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-xl shadow-md border border-zinc-400/50 dark:border-zinc-700/30 relative overflow-hidden">
								<div className="w-4 h-4 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-500 mb-2 shadow-inner"></div>
								<span className="font-medium text-center">{t.portfolioBackedLoan}</span>
								<span className="text-xs text-center text-gray-500">{t.payInterestOverTime}</span>
								{(finalYear.loanStrategy - summary.totalLoanNeeded) > finalYear.sellStrategy && (
									<div className="absolute -right-[40%] top-[2%] w-full rotate-45 transform">
										<div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-[10px] sm:text-xs py-1 px-6 shadow-lg border border-emerald-400/30 text-center whitespace-nowrap">
											<span className="font-semibold tracking-wider">
												{formatCurrencySafe(Math.round((finalYear.loanStrategy - summary.totalLoanNeeded)/1000))}
											</span>
										</div>
									</div>
								)}
							</div>
							<div className="flex flex-col space-y-2 items-center p-4 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md rounded-xl shadow-md border border-zinc-400/50 dark:border-zinc-700/30 relative overflow-hidden">
								<div className="w-4 h-4 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 mb-2 shadow-inner"></div>
								<span className="font-medium text-center">{t.sellPortfolioAssets}</span>
								<span className="text-xs text-center text-gray-500">{t.payTaxNow}</span>
								{finalYear.sellStrategy > (finalYear.loanStrategy - summary.totalLoanNeeded) && (
									<div className="absolute -right-[30%] top-[5%] w-full rotate-45 transform">
										<div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] sm:text-xs py-1 px-6 shadow-lg border border-amber-400/30 text-center whitespace-nowrap">
											<span className="font-semibold tracking-wider">
												{formatCurrencySafe(Math.round(finalYear.sellStrategy/1000))}
											</span>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					<div className="grid gap-6 md:grid-cols-2">
						<div className="space-y-6">
							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<Label className="text-sm font-normal">{t.marketReturnRate}</Label>
									<HelpButton sliderKey="marketReturn" />
								</div>
								<Slider
									value={[inputs.marketReturn]}
									onValueChange={(value) => setInputs({ ...inputs, marketReturn: value[0] })}
									min={1}
									max={20}
									step={0.5}
									className="py-2"
								/>
								<div className="flex justify-between text-xs text-gray-500">
									<span>1%</span>
									<span className="font-medium text-gray-800 dark:text-gray-200">
										{inputs.marketReturn}%
									</span>
									<span>20%</span>
								</div>
							</div>
						</div>

						<div className="space-y-6">
							<div className="space-y-4">
								<div className="flex items-center gap-2">
									<Label className="text-sm font-normal">{t.loanInterestRate}</Label>
									<HelpButton sliderKey="interestRate" />
								</div>
								<Slider
									value={[inputs.interestRate]}
									onValueChange={(value) => setInputs({ ...inputs, interestRate: value[0] })}
									min={1}
									max={10}
									step={0.25}
									className="py-2"
								/>
								<div className="flex justify-between text-xs text-gray-500">
									<span>1%</span>
									<span className="font-medium text-gray-800 dark:text-gray-200">
										{inputs.interestRate}%
									</span>
									<span>10%</span>
								</div>
							</div>
						</div>
					</div>

					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<Label className="text-sm font-normal">{t.profitPercentage}</Label>
							<HelpButton sliderKey="profitPercentage" />
						</div>
						<Slider
							value={[inputs.profitPercentage]}
							onValueChange={(value) => setInputs({ ...inputs, profitPercentage: value[0] })}
							min={0}
							max={100}
							step={1}
							className="py-2"
						/>
						<div className="flex justify-between text-xs text-gray-500">
							<span>0%</span>
							<span className="font-medium text-gray-800 dark:text-gray-200">
								{inputs.profitPercentage}%
							</span>
							<span>100%</span>
						</div>
					</div>

					<div className="h-80 mt-8 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p--2 md:p-6 rounded-2xl border border-white/50 dark:border-zinc-700/30 shadow-lg">
						<ResponsiveContainer width="100%" height="100%">
							<LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 10 }}>
								<CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
								<XAxis
									dataKey="year"
									tickLine={false}
									axisLine={{ stroke: '#eaeaea' }}
									tick={{ fill: '#888', fontSize: 12 }}
									label={{
										value: 'Years',
										position: 'insideBottom',
										offset: -5,
										fill: '#888',
										fontSize: 12,
									}}
								/>
								<YAxis
									tickFormatter={(value) => abbreviateNumber(value)}
									tickLine={false}
									axisLine={{ stroke: '#eaeaea' }}
									tick={{ fill: '#888', fontSize: 12 }}
									width={60}
									label={windowWidth >= 640 ? {
										value: t.portfolioValue,
										angle: -90,
										position: 'insideLeft',
										offset: -5,
										fill: '#888',
										fontSize: 12,
									} : undefined}
								/>
								<RechartsTooltip
									contentStyle={{
										backgroundColor: 'hsl(var(--background) / 0.95)',
										borderRadius: '8px',
										border: '1px solid hsl(var(--border) / 0.2)',
										boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
										padding: '8px 12px',
										color: 'hsl(var(--foreground))',
									}}
									formatter={(value, name) => {
										if (value === undefined || name === undefined) return ['', ''];
										const strategyName = {
											loanStrategy: 'Loan Strategy',
											sellStrategy: 'Sell Strategy',
											netWorth: 'Net Worth (Loan)',
										}[name as 'loanStrategy' | 'sellStrategy' | 'netWorth'];
										return [
											<span style={{ color: 'hsl(var(--foreground))', fontWeight: 500 }}>{formatCurrencySafe(Number(value))}</span>,
											<span style={{ color: 'hsl(var(--foreground) / 0.8)' }}>{strategyName}</span>
										];
									}}
									labelFormatter={(year) => (
										<span style={{ color: 'hsl(var(--foreground) / 0.7)', fontSize: '0.875rem' }}>
											Year {year}
										</span>
									)}
								/>
								<Legend
									verticalAlign="top"
									height={36}
									iconType="circle"
									iconSize={8}
									wrapperStyle={windowWidth < 640 ? { fontSize: '10px' } : { fontSize: '12px' }}
									formatter={(value) => (
										<span style={{ color: '#666', fontSize: windowWidth < 640 ? 10 : 12, marginLeft: 8 }}>{value}</span>
									)}
								/>
								<Line
									type="monotone"
									dataKey="sellStrategy"
									name="Sell Strategy"
									stroke="#d97706"
									strokeWidth={3}
									dot={{ r: 1 }}
									activeDot={{ r: 5, strokeWidth: 0 }}
								/>
								<Line
									type="monotone"
									dataKey="loanStrategy"
									name="Loan Strategy"
									stroke="#059669"
									strokeWidth={3}
									dot={{ r: 1 }}
									activeDot={{ r: 5, strokeWidth: 0 }}
								/>
								<Line
									type="monotone"
									dataKey="netWorth"
									name="Net Worth (Loan)"
									stroke="oklch(0.845 0.143 164.978)" // emerald-300
									strokeWidth={2}
									dot={{ r: 0 }}
									activeDot={{ r: 4, strokeWidth: 0 }}
								/>
							</LineChart>
						</ResponsiveContainer>
					</div>
					{/* Loan Strategy Results*/}
					<div className="grid gap-6 md:grid-cols-2">
						{/* Loan Strategy */}
						<div className="flex flex-col h-full bg-gradient-to-br from-emerald-50/95 via-emerald-50/90 to-zinc-50/95 dark:from-emerald-950/30 dark:via-emerald-900/30 dark:to-zinc-900/30 backdrop-blur-md rounded-2xl p-6 shadow-md border border-emerald-100/50 dark:border-emerald-900/50">
							<h3 className="font-medium text-md mb-4 text-emerald-900 dark:text-emerald-200">
								{t.summaryLoanStrategy}
							</h3>
							<div className="space-y-3 flex-grow mb-4">
								<div className="flex justify-between text-sm">
									<span className="text-gray-600 dark:text-gray-200/80">{t.summaryRequiredLoan}</span>
									<span className="font-medium">
										{formatCurrencySafe(summary.totalLoanNeeded)}
									</span>
								</div>
								{loanStrategy === 'monthly' && (
									<div className="flex justify-between text-sm">
										<span className="text-gray-600 dark:text-gray-200/80">
											{t.summaryMonthlyPayment}
										</span>
										<span className="font-medium">
											{formatCurrencySafe(finalYear.monthlyPayment)}
										</span>
									</div>
								)}
								<div className="flex justify-between text-sm">
									<span className="text-gray-600 dark:text-gray-200/80">
										{loanStrategy === 'upfront' ? t.summaryPrepaidInterest : t.summaryTotalInterest}
									</span>
									<span className="font-medium">
										{formatCurrencySafe(finalYear.totalInterestPaid)}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600 dark:text-gray-200/80">{t.summaryFinalValue}</span>
									<span className="font-medium">
										{formatCurrencySafe(finalYear.loanStrategy)}
									</span>
								</div>
							</div>

							<div className="flex justify-between bg-gradient-to-r from-emerald-100/95 to-emerald-50/95 dark:from-emerald-900/90 dark:to-emerald-800/85 backdrop-blur-sm px-0 py-3 rounded-lg mt-auto text-sm border border-emerald-200/50 dark:border-emerald-700/50">
								<span className="font-medium text-emerald-900 dark:text-emerald-100 pl-3">
									{t.summaryNetWorth}
								</span>
								<span className="font-medium text-emerald-900 dark:text-emerald-100 pr-3">
									{formatCurrencySafe(finalYear.loanStrategy - summary.totalLoanNeeded)}
								</span>
							</div>
						</div>
						{/* Sell Strategy */}
						<div className="flex flex-col h-full bg-gradient-to-br from-amber-50/95 via-amber-700/10 to-zinc-50/95 dark:from-amber-950/30 dark:via-amber-900/30 dark:to-zinc-900/30 backdrop-blur-md rounded-2xl p-6 shadow-md border border-amber-100/50 dark:border-amber-900/50">
							<h3 className="font-medium text-md mb-4 text-amber-900 dark:text-amber-200">
								{t.summarySellStrategy}
							</h3>
							<div className="space-y-3 flex-grow mb-4">
								<div className="flex justify-between text-sm">
									<span className="text-gray-600 dark:text-gray-200/80">{t.summaryAmountToSell}</span>
									<span className="font-medium">
										{formatCurrencySafe(summary.amountToSell)}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600 dark:text-gray-200/80">{t.summaryTaxPaid}</span>
									<span className="font-medium">
										{formatCurrencySafe(summary.taxPaid)}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600 dark:text-gray-200/80">
										{t.summaryRemainingPortfolio}
									</span>
									<span className="font-medium">
										{formatCurrencySafe(inputs.currentValue - summary.amountToSell)}
									</span>
								</div>
							</div>
							<div className="flex mt-auto justify-between bg-gradient-to-r from-amber-100/95 to-amber-50/95 dark:from-amber-900/90 dark:to-amber-800/85 backdrop-blur-sm px-0 py-3 rounded-lg text-sm border border-amber-200/50 dark:border-amber-700/50">
								<span className="font-medium text-amber-900 dark:text-amber-100 pl-3">
									{/*t.summaryFinalValue*/ t.summaryNetWorth}
								</span>
								<span className="font-medium text-amber-900 dark:text-amber-100 pr-3">
									{formatCurrencySafe(finalYear.sellStrategy)}
								</span>
							</div>
						</div>
					</div>

					<Button
						variant="ghost"
						onClick={() => setShowDetails(!showDetails)}
						className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gray-100/80 to-gray-50/80 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-md rounded-xl py-4 hover:from-gray-200/80 hover:to-gray-100/80 dark:hover:from-gray-700/50 dark:hover:to-gray-800/50 transition-all border border-white/50 dark:border-gray-700/30 shadow-sm"
					>
						{showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
						<span className="font-medium text-sm text-gray-600 dark:text-gray-400">
							{showDetails ? 'Hide Details' : 'Show Details'}
						</span>
					</Button>

					{showDetails && (
						<div className="mt-6 space-y-8 bg-gradient-to-br from-gray-50/90 via-white/80 to-gray-50/90 dark:from-gray-900/70 dark:via-gray-800/60 dark:to-gray-900/70 backdrop-blur-md rounded-2xl p-8 border border-white/50 dark:border-gray-700/30 shadow-lg">
							{/* Loan Strategy selector */}
							<div>
								<h4 className="font-medium text-md mb-4 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
									Strategy Comparison
								</h4>
								<div className="p-6 bg-transparent  backdrop-blur-md rounded-2xl border border-gray-200/50 dark:border-gray-700/30 shadow-lg mb-6">
									<div className="grid grid-cols-1 gap-y-6 text-sm">
										<div className="flex items-start">
											<div className="w-3 h-3 rounded-full bg-gradient-to-br from-amber-500 to-amber-600 mt-1 mr-3 flex-shrink-0 shadow-inner"></div>
											<div>
												<div className="font-medium">{t.sellStrategy}</div>
												<div className="text-xs text-gray-500 mt-1">{t.realizeGains}</div>
											</div>
										</div>
										<div className="flex items-start">
											<div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 mt-1 mr-3 flex-shrink-0 shadow-inner"></div>
											<div>
												<div className="font-medium">{t.loanStrategy}</div>
												<div className="text-xs text-gray-500 mt-1">{t.keepInvestments}</div>
											</div>
										</div>
										<div className="flex items-start">
											<div className="w-3 h-3 rounded-full bg-gradient-to-br from-emerald-200 to-emerald-300 mt-1 mr-3 flex-shrink-0 shadow-inner"></div>
											<div>
												<div className="font-medium">{t.netWorth}</div>
												<div className="text-xs text-gray-500 mt-1">{t.netWorthDesc}</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div>
								<h4 className="font-medium text-md mb-4 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
									Loan Payment Strategy
								</h4>
								<div className="grid lg:grid-cols-2 gap-6 transition-all duration-300">
									<Button
										variant="strategy"
										onClick={() => setLoanStrategy('upfront')}
										data-state={loanStrategy === 'upfront' ? 'active' : 'inactive'}
										className="p-4 h-auto flex flex-col items-center text-center rounded-xl"
									>
										<span className="font-medium mb-2">
											{t.upfrontInterestTitle}
										</span>
										<span className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px]">{t.borrowExtra}</span>
									</Button>
									<Button
										variant="strategy"
										onClick={() => setLoanStrategy('monthly')}
										data-state={loanStrategy === 'monthly' ? 'active' : 'inactive'}
										className="p-4 h-auto flex flex-col items-center text-center rounded-xl"
									>
										<span className="font-medium mb-2">
											{t.monthlyPaymentsTitle}
										</span>
										<span className="text-xs text-gray-500 dark:text-gray-400 max-w-[200px]">
											{t.payInterestMonthly}
										</span>
									</Button>
								</div>
							</div>

							<div>
								<h4 className="font-medium text-md mb-4 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
									Parameters
								</h4>
								<div className="space-y-6 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md rounded-xl p-6 shadow-md border border-white/50 dark:border-zinc-700/30">
									<div className="grid md:grid-cols-2 gap-8">
										<div
											ref={portfolioValueRef}
											className={`space-y-4 ${
												animatingRef === 'currentValue' ? 'animate-bounce [animation-duration:2s]' : ''
											}`}
										>
											<div className="flex items-center gap-2">
												<Label className="text-sm font-normal">{t.portfolioValue}</Label>
												<HelpButton sliderKey="currentValue" />
												<span className="ml-auto font-medium">
													{formatCurrencySafe(inputs.currentValue)}
												</span>
											</div>
											<Slider
												value={[inputs.currentValue]}
												onValueChange={(value) =>
													setInputs({ ...inputs, currentValue: value[0] })
												}
												min={50000}
												max={500000}
												step={10000}
												className="py-2"
											/>
											<div className="flex justify-between text-xs text-gray-500">
												<span>{formatCurrencySafe(50000)}</span>
												<span>{formatCurrencySafe(500000)}</span>
											</div>
										</div>
										<div
											ref={targetCashRef}
											className={`space-y-4 ${
												animatingRef === 'targetCash' ? 'animate-bounce [animation-duration:2s]' : ''
											}`}
										>
											<div className="flex items-center gap-2">
												<Label className="text-sm font-normal">{t.targetCash}</Label>
												<HelpButton sliderKey="targetCash" />
												<span className="ml-auto font-medium">
													{formatCurrencySafe(inputs.targetCash)}
												</span>
											</div>
											<Slider
												value={[inputs.targetCash]}
												onValueChange={(value) =>
													setInputs({ ...inputs, targetCash: value[0] })
												}
												min={10000}
												max={300000}
												step={10000}
												className="py-2"
											/>
											<div className="flex justify-between text-xs text-gray-500">
												<span>{formatCurrencySafe(10000)}</span>
												<span>{formatCurrencySafe(300000)}</span>
											</div>
										</div>
									</div>

									<div className="grid md:grid-cols-2 gap-8">
										<div className="space-y-4">
											<div className="flex items-center gap-2">
												<Label className="text-sm font-normal">{t.investmentPeriod}</Label>
												<HelpButton sliderKey="years" />
												<span className="ml-auto font-medium">
													{inputs.years} {inputs.years === 1 ? t.yearLabel : t.yearsLabel}
												</span>
											</div>
											<Slider
												value={[inputs.years]}
												onValueChange={(value) => setInputs({ ...inputs, years: value[0] })}
												min={1}
												max={10}
												step={1}
												className="py-2"
											/>
											<div className="flex justify-between text-xs text-gray-500">
												<span>1 {t.yearLabel}</span>
												<span>10 {t.yearsLabel}</span>
											</div>
										</div>

										<div
											ref={taxRateRef}
											className={`space-y-4 ${animatingRef === 'taxRate' ? 'animate-bounce [animation-duration:2s]' : ''}`}
										>
											<div className="flex items-center gap-2">
												<Label className="text-sm font-normal">{t.taxRate}</Label>
												<HelpButton sliderKey="taxRate" />
												<span className="ml-auto font-medium">{inputs.taxRate}%</span>
											</div>
											<Slider
												value={[inputs.taxRate]}
												onValueChange={(value) => setInputs({ ...inputs, taxRate: value[0] })}
												min={0}
												max={50}
												step={1}
												className="py-2"
											/>
											<div className="flex justify-between text-xs text-gray-500">
												<span>0%</span>
												<span>50%</span>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div>
								<h4 className="font-medium text-md mb-4 bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-400 bg-clip-text text-transparent">
									Formulas
								</h4>
								<div className="grid gap-3">
									{Object.entries(formulas).map(([key, formula]) => (
										<div
											key={key}
											className="p-4 bg-white/70 dark:bg-zinc-800/70 backdrop-blur-sm rounded-lg shadow-sm border border-white/50 dark:border-zinc-700/30"
										>
											<p className="font-mono text-xs text-gray-600 dark:text-gray-400">
												{formula}
											</p>
										</div>
									))}
								</div>
							</div>
						</div>
					)}
				</CardContent>
			</Card>

			{/* Info Drawer */}
			<Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
				<DrawerContent className="max-h-[30vh] rounded-t-3xl overflow-hidden backdrop-blur-xl bg-white/90 dark:bg-zinc-900/90 border-t border-white/20 dark:border-white/10 shadow-2xl">
					<div className="absolute inset-0 bg-gradient-to-b from-zinc-50/30 via-transparent to-emerald-50/30 dark:from-zinc-950/20 dark:to-emerald-950/20 rounded-t-3xl pointer-events-none"></div>

					<div className="w-12 h-1.5 bg-gray-300/50 dark:bg-gray-600/50 rounded-full mx-auto mt-2.5 mb-1"></div>

					<DrawerHeader className="border-b border-zinc-100/50 dark:border-zinc-800/30 relative z-10 px-8">
						<DrawerTitle className="text-xl font-light tracking-tight bg-gradient-to-r from-emerald-600 to-emerald-500 dark:from-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent">
							{drawerContent.title}
						</DrawerTitle>
					</DrawerHeader>

					<div className="relative z-10 px-8 py-6">
						<div className="bg-gradient-to-br from-white/70 to-zinc-50/70 dark:from-zinc-800/70 dark:to-zinc-900/50 backdrop-blur-md p-5 rounded-2xl border border-white/50 dark:border-zinc-700/30 shadow-lg">
							<DrawerDescription className="text-sm leading-relaxed text-gray-700 dark:text-gray-200">
								{drawerContent.description}
							</DrawerDescription>
						</div>
					</div>

					<DrawerFooter className="relative z-10 px-8 pb-6 pt-0">
						<DrawerClose asChild>
							<Button
								variant="outline"
								className="w-full py-3 bg-gradient-to-r from-zinc-50/90 to-emerald-50/90 dark:from-zinc-900/40 dark:to-emerald-900/40 backdrop-blur-md rounded-xl border border-zinc-100/50 dark:border-zinc-700/30 shadow-sm hover:from-zinc-100/90 hover:to-emerald-100/90 dark:hover:from-zinc-800/40 dark:hover:to-emerald-800/40 transition-all"
							>
								<span className="font-medium text-sm bg-gradient-to-r from-emerald-600 to-emerald-500 dark:from-emerald-400 dark:to-emerald-500 bg-clip-text text-transparent">
									{t.close}
								</span>
							</Button>
						</DrawerClose>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</div>
	);
};

export const PortfolioLoanCalculator_V3 = PortfolioTaxCalculator;
