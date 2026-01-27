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
import { TrendingUp, Wallet, Home, Zap } from 'lucide-react';
import type { Year1Results, DerivedValues } from '../types';
import { roundForDisplay } from '../utils/calculations';

interface ResultsPanelProps {
  year1: Year1Results;
  derived: DerivedValues;
  translations: any;
  formatCurrency: (value: number) => string;
}

export function ResultsPanel({
  year1,
  derived,
  translations: t,
  formatCurrency,
}: ResultsPanelProps) {
	const { withLeverage, noLeverage } = year1;

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
						<div>
							<div className="flex justify-between items-center mb-2">
								<div className="flex items-center gap-2">
									<Wallet className="w-4 h-4 text-amber-600 dark:text-amber-400" />
									<span className="font-medium text-gray-900 dark:text-gray-100">
										{t.engine1Title}
									</span>
								</div>
								<span className="font-bold text-amber-600 dark:text-amber-400">
									{formatCurrency(
										roundForDisplay(
											withLeverage.annualCashFlow,
										),
									)}
								</span>
							</div>
							<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
								<div
									className="bg-amber-500 h-2 rounded-full transition-all duration-500"
									style={{
										width: `${Math.max(0, withLeverage.engines.cashFlow.percent)}%`,
									}}
								/>
							</div>
							<p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
								{t.engine1Desc}
							</p>
						</div>

						{/* Engine 2: Appreciation */}
						<div>
							<div className="flex justify-between items-center mb-2">
								<div className="flex items-center gap-2">
									<TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
									<span className="font-medium text-gray-900 dark:text-gray-100">
										{t.engine2Title}
									</span>
								</div>
								<span className="font-bold text-emerald-600 dark:text-emerald-400">
									{formatCurrency(
										roundForDisplay(
											withLeverage.appreciation,
										),
									)}
								</span>
							</div>
							<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
								<div
									className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
									style={{
										width: `${withLeverage.engines.appreciation.percent}%`,
									}}
								/>
							</div>
							<p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
								{t.engine2Desc}
							</p>
						</div>

						{/* Engine 3: Principal Paydown */}
						<div>
							<div className="flex justify-between items-center mb-2">
								<div className="flex items-center gap-2">
									<Home className="w-4 h-4 text-sky-600 dark:text-sky-400" />
									<span className="font-medium text-gray-900 dark:text-gray-100">
										{t.engine3Title}
									</span>
								</div>
								<span className="font-bold text-sky-600 dark:text-sky-400">
									{formatCurrency(
										roundForDisplay(
											withLeverage.principalPaydown,
										),
									)}
								</span>
							</div>
							<div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
								<div
									className="bg-sky-500 h-2 rounded-full transition-all duration-500"
									style={{
										width: `${withLeverage.engines.principalPaydown.percent}%`,
									}}
								/>
							</div>
							<p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
								{t.engine3Desc}
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
