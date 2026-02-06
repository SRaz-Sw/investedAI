/**
 * Exit Summary Panel
 *
 * Shows what the investor walks away with if they sell at a given year.
 * Three-column layout: You Invested | Sale Breakdown | Bottom Line
 *
 * Reacts to the same selectedYearStore as the 3 Engines panel.
 * Defaults to the full mortgage term when no year is selected.
 */

'use client';

import { Card, CardContent } from '@/components/ui/card';
import { LogOut, X, TrendingUp, TrendingDown } from 'lucide-react';
import type { ExitAnalysis } from '../types';
import { roundForDisplay } from '../utils/calculations';

interface ExitSummaryPanelProps {
	exitAnalysis: ExitAnalysis;
	formatCurrency: (value: number) => string;
	translations: any;
	selectedYear: number | null;
	onResetYear?: () => void;
	mortgageTermYears: number;
}

/**
 * A single line item in the sale breakdown column.
 * Prefix with minus sign for deductions.
 */
function BreakdownRow({
	label,
	value,
	formatCurrency,
	deduction = false,
	highlight = false,
	dimmed = false,
}: {
	label: string;
	value: number;
	formatCurrency: (value: number) => string;
	deduction?: boolean;
	highlight?: boolean;
	dimmed?: boolean;
}) {
	return (
		<div
			className={`flex justify-between items-center py-1 ${
				highlight
					? 'font-semibold text-gray-900 dark:text-gray-100'
					: dimmed
						? 'text-gray-400 dark:text-gray-500'
						: 'text-gray-600 dark:text-gray-400'
			}`}
		>
			<span className="text-sm">
				{deduction && !dimmed ? '− ' : ''}
				{label}
			</span>
			<span className={`text-sm font-medium ${highlight ? 'text-violet-700 dark:text-violet-300' : ''}`}>
				{dimmed && value === 0
					? '—'
					: formatCurrency(roundForDisplay(Math.abs(value)))}
			</span>
		</div>
	);
}

export function ExitSummaryPanel({
	exitAnalysis,
	formatCurrency,
	translations: t,
	selectedYear,
	onResetYear,
	mortgageTermYears,
}: ExitSummaryPanelProps) {
	const displayYear =
		selectedYear && selectedYear > 0 ? selectedYear : mortgageTermYears;
	const isCustomYear = selectedYear && selectedYear > 0 && selectedYear !== mortgageTermYears;
	const isProfitable = exitAnalysis.totalProfit >= 0;

	return (
		<Card className="bg-gradient-to-br from-violet-50/80 to-violet-100/50 dark:from-violet-950/40 dark:to-violet-900/20 backdrop-blur-md border border-violet-200/50 dark:border-violet-800/30 shadow-lg overflow-hidden">
			<CardContent className="p-6">
				{/* Header */}
				<div className="flex items-center justify-between mb-5">
					<div className="flex items-center gap-2">
						<LogOut className="w-6 h-6 text-violet-600 dark:text-violet-400" />
						<div>
							<h3 className="text-lg font-semibold text-violet-900 dark:text-violet-200">
								{t.exitSummary}
							</h3>
							<p className="text-sm text-violet-700/70 dark:text-violet-400/70">
								{t.exitSummaryDesc}
							</p>
						</div>
					</div>
					{isCustomYear ? (
						<button
							onClick={onResetYear}
							className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium
								bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300
								rounded-full hover:bg-violet-200 dark:hover:bg-violet-800/50
								transition-colors cursor-pointer"
						>
							{t.exitAtYear} {displayYear}
							<X className="w-3.5 h-3.5" />
						</button>
					) : (
						<span className="px-3 py-1.5 text-sm font-medium bg-violet-100/60 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-full">
							{t.exitAtYear} {displayYear}
						</span>
					)}
				</div>

				{/* Three-column layout */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Column 1: You Invested */}
					<div className="flex flex-col items-center justify-center text-center p-4 bg-white/50 dark:bg-zinc-800/30 rounded-xl border border-violet-200/30 dark:border-violet-700/20">
						<p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
							{t.youInvested}
						</p>
						<p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
							{formatCurrency(roundForDisplay(exitAnalysis.totalInvested))}
						</p>
						<p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
							{t.cashToClose}
						</p>
					</div>

					{/* Column 2: Sale Breakdown */}
					<div className="p-4 bg-white/50 dark:bg-zinc-800/30 rounded-xl border border-violet-200/30 dark:border-violet-700/20">
						<p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
							{t.saleBreakdown}
						</p>
						<div className="space-y-0.5">
							<BreakdownRow
								label={t.propertyValueAtExit}
								value={exitAnalysis.propertyValueAtExit}
								formatCurrency={formatCurrency}
							/>
							<BreakdownRow
								label={t.mortgagePayoff}
								value={exitAnalysis.mortgagePayoff}
								formatCurrency={formatCurrency}
								deduction
								dimmed={exitAnalysis.mortgagePayoff === 0}
							/>
							<BreakdownRow
								label={t.sellingCostsLabel}
								value={exitAnalysis.sellingCosts}
								formatCurrency={formatCurrency}
								deduction
								dimmed={exitAnalysis.sellingCosts === 0}
							/>
							<BreakdownRow
								label={t.capitalGainsTaxLabel}
								value={exitAnalysis.capitalGainsTax}
								formatCurrency={formatCurrency}
								deduction
								dimmed={exitAnalysis.capitalGainsTax === 0}
							/>
							<div className="border-t border-violet-200/50 dark:border-violet-700/30 mt-1 pt-1">
								<BreakdownRow
									label={t.netSaleProceeds}
									value={exitAnalysis.netSaleProceeds}
									formatCurrency={formatCurrency}
									highlight
								/>
							</div>
							<BreakdownRow
								label={`+ ${t.cashFlowEarned}`}
								value={exitAnalysis.totalCashFlow}
								formatCurrency={formatCurrency}
							/>
						</div>
					</div>

					{/* Column 3: Bottom Line */}
					<div className="flex flex-col items-center justify-center text-center p-4 bg-white/50 dark:bg-zinc-800/30 rounded-xl border border-violet-200/30 dark:border-violet-700/20">
						<p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
							{t.totalProfit}
						</p>
						<div className="flex items-center gap-1.5 mb-2">
							{isProfitable ? (
								<TrendingUp className="w-5 h-5 text-emerald-500" />
							) : (
								<TrendingDown className="w-5 h-5 text-red-500" />
							)}
							<p
								className={`text-2xl font-bold ${
									isProfitable
										? 'text-emerald-600 dark:text-emerald-400'
										: 'text-red-600 dark:text-red-400'
								}`}
							>
								{formatCurrency(roundForDisplay(exitAnalysis.totalProfit))}
							</p>
						</div>
						<div className="space-y-1">
							<p className="text-sm text-gray-600 dark:text-gray-400">
								{t.totalReturn}{' '}
								<span
									className={`font-semibold ${
										isProfitable
											? 'text-emerald-600 dark:text-emerald-400'
											: 'text-red-600 dark:text-red-400'
									}`}
								>
									{exitAnalysis.totalROI.toFixed(1)}%
								</span>
							</p>
							<p className="text-sm text-gray-600 dark:text-gray-400">
								{t.annualizedReturn}{' '}
								<span
									className={`font-semibold ${
										isProfitable
											? 'text-emerald-600 dark:text-emerald-400'
											: 'text-red-600 dark:text-red-400'
									}`}
								>
									{exitAnalysis.annualizedReturn.toFixed(1)}%
								</span>
							</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
