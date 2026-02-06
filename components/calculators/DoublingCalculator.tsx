'use client';

import React, { useState, useEffect } from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { useTranslationStore } from '@/lib/translations';
import { doublingTranslations } from '@/lib/translations/doubling';
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from '@/components/ui/card';

export function DoublingCalculator() {
	const { language, direction } = useTranslationStore();
	const t = doublingTranslations[language];

	const [rate, setRate] = useState(7);
	const [inputValue, setInputValue] = useState('7');
	const [isFocused, setIsFocused] = useState(false);
	const [years, setYears] = useState(72 / 7);
	const [isAnimating, setIsAnimating] = useState(false);

	const [exitYears, setExitYears] = useState(10);
	const [exitInputValue, setExitInputValue] = useState('10');
	const [exitIsFocused, setExitIsFocused] = useState(false);
	const [isGrowthAnimating, setIsGrowthAnimating] = useState(false);

	useEffect(() => {
		setIsAnimating(true);
		const doublingTime = rate > 0 ? 72 / rate : Infinity;
		setYears(doublingTime);
		const timer = setTimeout(() => setIsAnimating(false), 300);
		return () => clearTimeout(timer);
	}, [rate]);

	useEffect(() => {
		if (!isFocused) {
			setInputValue(String(rate));
		}
	}, [rate, isFocused]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);
		const parsed = parseFloat(value);
		if (!isNaN(parsed) && parsed > 0) {
			setRate(parsed);
		}
	};

	const handleInputBlur = () => {
		setIsFocused(false);
		const parsed = parseFloat(inputValue);
		if (isNaN(parsed) || parsed <= 0) {
			setInputValue(String(rate));
		} else {
			setRate(parsed);
			setInputValue(String(parsed));
		}
	};

	useEffect(() => {
		setIsGrowthAnimating(true);
		const timer = setTimeout(() => setIsGrowthAnimating(false), 300);
		return () => clearTimeout(timer);
	}, [exitYears, rate]);

	useEffect(() => {
		if (!exitIsFocused) {
			setExitInputValue(String(exitYears));
		}
	}, [exitYears, exitIsFocused]);

	const handleExitInputChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const value = e.target.value;
		setExitInputValue(value);
		const parsed = parseInt(value, 10);
		if (!isNaN(parsed) && parsed >= 1 && parsed <= 50) {
			setExitYears(parsed);
		}
	};

	const handleExitInputBlur = () => {
		setExitIsFocused(false);
		const parsed = parseInt(exitInputValue, 10);
		if (isNaN(parsed) || parsed < 1) {
			setExitInputValue(String(exitYears));
		} else {
			const clamped = Math.min(parsed, 50);
			setExitYears(clamped);
			setExitInputValue(String(clamped));
		}
	};

	const growth = Math.pow(1 + rate / 100, exitYears);
	const totalPercent = (growth * 100).toFixed(1);
	const gainPercent = ((growth - 1) * 100).toFixed(1);

	const yearsDisplay = years === Infinity ? '∞' : years.toFixed(1);
	const preciseYears = (Math.log(2) / Math.log(1 + rate / 100)).toFixed(
		2
	);

	const presets = [
		{ label: t.presetSavingsAccount, rate: 2, color: '#94a3b8' },
		{ label: t.presetBonds, rate: 5, color: '#60a5fa' },
		{ label: t.presetSP500, rate: 10, color: '#34d399' },
		{ label: t.presetAggressiveGrowth, rate: 15, color: '#f472b6' },
	];

	return (
		<div
			className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4"
			dir={direction()}
		>
			<div className="w-full max-w-2xl">
				<Card className="backdrop-blur-xl bg-card/80 border-border/50 shadow-2xl">
					<CardHeader className="text-center pb-6">
						<CardTitle className="text-3xl md:text-4xl font-bold">
							{t.title}
						</CardTitle>
						<CardDescription className="text-sm md:text-base">
							{t.subtitle}
						</CardDescription>
					</CardHeader>

					<CardContent className="space-y-8">
						{/* Slider Section */}
						<div className="space-y-6">
							<div className="flex justify-between items-end">
								<span className="text-muted-foreground text-sm font-medium">
									{t.annualReturnRate}
								</span>
								<div className="flex items-baseline gap-1">
									<input
										type="text"
										inputMode="decimal"
										value={inputValue}
										onChange={handleInputChange}
										onFocus={() => setIsFocused(true)}
										onBlur={handleInputBlur}
										className={`w-24 md:w-32 text-right text-5xl md:text-6xl font-bold bg-transparent bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent transition-all duration-300 outline-none focus:ring-2 focus:ring-primary/30 rounded-lg ${
											isAnimating
												? 'scale-105'
												: 'scale-100'
										}`}
									/>
									<span className="text-2xl font-semibold text-muted-foreground">
										%
									</span>
								</div>
							</div>

							<div className="pt-2 pb-4">
								<SliderPrimitive.Root
									className="relative flex w-full touch-none select-none items-center"
									value={[rate]}
									onValueChange={(v) => setRate(v[0])}
									min={1}
									max={20}
									step={0.5}
									aria-label="Annual Return Rate"
								>
									<SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-primary/20">
										<SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-primary/80 to-primary rounded-full" />
									</SliderPrimitive.Track>
									<SliderPrimitive.Thumb className="block h-7 w-7 rounded-full border-4 border-primary bg-background shadow-lg ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 cursor-grab active:cursor-grabbing" />
								</SliderPrimitive.Root>
							</div>

							<div className="flex justify-between text-xs text-muted-foreground font-medium">
								<span>1%</span>
								<span>20%</span>
							</div>
						</div>

						{/* Result Display */}
						<div className="bg-primary/10 rounded-2xl p-6 md:p-8 border border-primary/20">
							<p className="text-muted-foreground text-center mb-2">
								{t.moneyWillDouble}
							</p>
							<div className="flex items-baseline justify-center gap-2">
								<span
									className={`text-6xl md:text-7xl font-bold text-foreground transition-all duration-300 ${
										isAnimating
											? 'opacity-50 scale-95'
											: 'opacity-100 scale-100'
									}`}
								>
									{yearsDisplay}
								</span>
								<span className="text-2xl text-muted-foreground">
									{t.years}
								</span>
							</div>

							<div className="mt-6 flex justify-center">
								<div className="flex items-center gap-2">
									{[
										...Array(
											Math.min(Math.ceil(years), 10)
										),
									].map((_, i) => (
										<div
											key={i}
											className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-primary/60 animate-pulse"
											style={{
												animationDelay: `${
													i * 100
												}ms`,
												opacity: 1 - i * 0.08,
											}}
										/>
									))}
									{years > 10 && (
										<span className="text-muted-foreground text-sm ml-1">
											...
										</span>
									)}
								</div>
							</div>
						</div>

						{/* Presets Grid */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-3">
							{presets.map((preset) => (
								<button
									key={preset.label}
									onClick={() => setRate(preset.rate)}
									className={`p-3 rounded-xl text-center transition-all duration-200 hover:scale-105 active:scale-95 ${
										rate === preset.rate
											? 'bg-primary/20 border-2 border-primary/40'
											: 'bg-muted/50 border border-border hover:bg-muted'
									}`}
								>
									<div
										className="w-3 h-3 rounded-full mx-auto mb-2"
										style={{
											backgroundColor: preset.color,
										}}
									/>
									<p className="text-foreground text-xs font-medium">
										{preset.label}
									</p>
									<p className="text-muted-foreground text-xs">
										{preset.rate}%
									</p>
								</button>
							))}
						</div>

						{/* Exit Year / Growth Section */}
						<div className="pt-6 border-t border-border">
							<div className="space-y-6">
								<div className="flex justify-between items-end">
									<span className="text-muted-foreground text-sm font-medium">
										{t.afterHowManyYears}
									</span>
									<div className="flex items-baseline gap-1">
										<input
											type="text"
											inputMode="numeric"
											value={exitInputValue}
											onChange={
												handleExitInputChange
											}
											onFocus={() =>
												setExitIsFocused(true)
											}
											onBlur={handleExitInputBlur}
											className={`w-20 md:w-24 text-right text-4xl md:text-5xl font-bold bg-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent transition-all duration-300 outline-none focus:ring-2 focus:ring-emerald-500/30 rounded-lg ${
												isGrowthAnimating
													? 'scale-105'
													: 'scale-100'
											}`}
										/>
										<span className="text-xl font-semibold text-muted-foreground">
											{t.years}
										</span>
									</div>
								</div>

								<div className="pt-2 pb-4">
									<SliderPrimitive.Root
										className="relative flex w-full touch-none select-none items-center"
										value={[exitYears]}
										onValueChange={(v) =>
											setExitYears(v[0])
										}
										min={1}
										max={50}
										step={1}
										aria-label="Investment Period"
									>
										<SliderPrimitive.Track className="relative h-3 w-full grow overflow-hidden rounded-full bg-emerald-500/20">
											<SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-emerald-500/80 to-emerald-500 rounded-full" />
										</SliderPrimitive.Track>
										<SliderPrimitive.Thumb className="block h-7 w-7 rounded-full border-4 border-emerald-500 bg-background shadow-lg ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-110 cursor-grab active:cursor-grabbing" />
									</SliderPrimitive.Root>
								</div>

								<div className="flex justify-between text-xs text-muted-foreground font-medium">
									<span>1</span>
									<span>50</span>
								</div>
							</div>

							<div className="bg-emerald-500/10 rounded-2xl p-6 md:p-8 border border-emerald-500/20 mt-6">
								<p className="text-muted-foreground text-center mb-2">
									{t.investmentWillGrow}
								</p>
								<div className="flex items-baseline justify-center gap-1">
									<span
										className={`text-5xl md:text-6xl font-bold text-foreground transition-all duration-300 ${
											isGrowthAnimating
												? 'opacity-50 scale-95'
												: 'opacity-100 scale-100'
										}`}
									>
										{totalPercent}%
									</span>
								</div>
								<p
									className={`text-center mt-2 text-emerald-400 font-semibold transition-all duration-300 ${
										isGrowthAnimating
											? 'opacity-50'
											: 'opacity-100'
									}`}
								>
									+{gainPercent}% {t.gain}
								</p>
							</div>
						</div>

						{/* Footer Note */}
						<div className="pt-6 border-t border-border">
							<p className="text-muted-foreground/60 text-xs text-center">
								{t.ruleOf72Note}
								<br />
								{t.preciseTime} {preciseYears} {t.years}.
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
