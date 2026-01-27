/**
 * Real Estate Calculator V2 - Results Panel Component
 *
 * Displays:
 * - Year 1 results (with/without leverage)
 * - Three Engines breakdown
 * - ROI comparison
 */

'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, Wallet, Home, Zap, DollarSign } from 'lucide-react';
import type { Year1Results, DerivedValues } from '../types';
import { roundForDisplay } from '../utils/calculations';

interface ResultsPanelProps {
	year1: Year1Results;
	derived: DerivedValues;
	translations: any;
	formatCurrency: (value: number) => string;
}

interface EngineRowProps {
	icon: React.ReactNode;
	title: string;
	description: string;
	value: number;
	percent: number;
	color: 'amber' | 'emerald' | 'sky';
	formatCurrency: (value: number) => string;
	invested: number;
	roi: number;
}

/**
 * Reusable component for displaying a single engine row with hover ROI reveal
 */
function EngineRow({
	icon,
	title,
	description,
	value,
	percent,
	color,
	formatCurrency,
	invested,
	roi,
}: EngineRowProps) {
	const colorClasses = {
		amber: {
			text: 'text-amber-600 dark:text-amber-400',
			bg: 'bg-amber-500',
			roiBg: 'bg-amber-100 dark:bg-amber-900/50',
		},
		emerald: {
			text: 'text-emerald-600 dark:text-emerald-400',
			bg: 'bg-emerald-500',
			roiBg: 'bg-emerald-100 dark:bg-emerald-900/50',
		},
		sky: {
			text: 'text-sky-600 dark:text-sky-400',
			bg: 'bg-sky-500',
			roiBg: 'bg-sky-100 dark:bg-sky-900/50',
		},
	};

	const colors = colorClasses[color];

	return (
		<div>
			<div className="flex justify-between items-center mb-2">
				<div className="flex items-center gap-2">
					{icon}
					<span className="font-medium text-gray-900 dark:text-gray-100">
						{title}
					</span>
				</div>
				<div className="group flex items-center gap-2">
					{/* ROI info - appears on hover */}
					<span
						className={`text-xs ${colors.roiBg} ${colors.text} px-2 py-0.5 rounded-full
						opacity-0 group-hover:opacity-100
						max-w-0 group-hover:max-w-xs
						overflow-hidden whitespace-nowrap
						transition-all duration-300 ease-out`}
					>
						{formatCurrency(invested)} → {roi.toFixed(1)}%
					</span>
					{/* Value */}
					<span className={`font-bold ${colors.text}`}>
						{formatCurrency(roundForDisplay(value))}
					</span>
				</div>
			</div>
			<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
				<div
					className={`${colors.bg} h-2 rounded-full transition-all duration-500`}
					style={{
						width: `${Math.max(0, percent)}%`,
					}}
				/>
			</div>
			<p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
				{description}
			</p>
		</div>
	);
}

export function ResultsPanel({
	year1,
	derived,
	translations: t,
	formatCurrency,
}: ResultsPanelProps) {
	const { withLeverage } = year1;
	const totalInvested = derived.totalCashRequired;

	// Calculate individual ROIs
	const cashFlowROI =
		(withLeverage.annualCashFlow / totalInvested) * 100;
	const appreciationROI =
		(withLeverage.appreciation / totalInvested) * 100;
	const principalPaydownROI =
		(withLeverage.principalPaydown / totalInvested) * 100;

	// Calculate total return
	const totalReturn =
		withLeverage.annualCashFlow +
		withLeverage.appreciation +
		withLeverage.principalPaydown;
	const totalROI = (totalReturn / totalInvested) * 100;

	return (
		<div className="space-y-6">
			{/* Three Engines Breakdown */}
			<Card className="bg-gradient-to-br from-emerald-50/80 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/20 backdrop-blur-md border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg overflow-hidden">
				<CardContent className="p-6">
					<div className="flex items-center gap-2 mb-4">
						<Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
						<div>
							<h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-200">
								{t.threeEngines}
							</h3>
							<p className="text-sm text-emerald-700/70 dark:text-emerald-400/70">
								{t.threeEnginesDesc}
							</p>
						</div>
					</div>

					<div className="space-y-4">
						{/* Engine 1: Cash Flow */}
						<EngineRow
							icon={
								<Wallet className="w-4 h-4 text-amber-600 dark:text-amber-400" />
							}
							title={t.engine1Title}
							description={t.engine1Desc}
							value={withLeverage.annualCashFlow}
							percent={withLeverage.engines.cashFlow.percent}
							color="amber"
							formatCurrency={formatCurrency}
							invested={totalInvested}
							roi={cashFlowROI}
						/>

						{/* Engine 2: Appreciation */}
						<EngineRow
							icon={
								<TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
							}
							title={t.engine2Title}
							description={t.engine2Desc}
							value={withLeverage.appreciation}
							percent={withLeverage.engines.appreciation.percent}
							color="emerald"
							formatCurrency={formatCurrency}
							invested={totalInvested}
							roi={appreciationROI}
						/>

						{/* Engine 3: Principal Paydown */}
						<EngineRow
							icon={
								<Home className="w-4 h-4 text-sky-600 dark:text-sky-400" />
							}
							title={t.engine3Title}
							description={t.engine3Desc}
							value={withLeverage.principalPaydown}
							percent={withLeverage.engines.principalPaydown.percent}
							color="sky"
							formatCurrency={formatCurrency}
							invested={totalInvested}
							roi={principalPaydownROI}
						/>

						{/* Total Row */}
						<div className="pt-4 border-t-2 border-emerald-300 dark:border-emerald-700">
							<div className="group flex justify-between items-center">
								<div className="flex items-center gap-2">
									<DollarSign className="w-5 h-5 text-emerald-700 dark:text-emerald-300" />
									<span className="font-bold text-lg text-gray-900 dark:text-gray-100">
										Total Return (Year 1)
									</span>
								</div>
								<div className="flex items-center gap-2">
									{/* ROI info - appears on hover */}
									<span
										className="text-xs bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full
										opacity-0 group-hover:opacity-100
										max-w-0 group-hover:max-w-xs
										overflow-hidden whitespace-nowrap
										transition-all duration-300 ease-out"
									>
										{formatCurrency(totalInvested)} → {totalROI.toFixed(1)}%
									</span>
									{/* Value */}
									<span className="font-bold text-lg text-emerald-700 dark:text-emerald-300">
										{formatCurrency(roundForDisplay(totalReturn))}
									</span>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
