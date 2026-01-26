/**
 * Real Estate Calculator Pro - Wealth Building Chart Component
 *
 * Displays a stacked area chart showing wealth accumulation over time
 * broken down by the 3 engines of profit:
 * - Cash Flow (accumulated rental income)
 * - Equity Built (principal paydown)
 * - Appreciation (property value growth)
 * - Portfolio Growth (compound growth from reinvesting cash flow) - optional
 */

'use client';

import React, { memo, useMemo } from 'react';
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
	ResponsiveContainer,
} from 'recharts';
import type { ChartDataPoint } from '../types';
import { formatAxisValue } from '../utils/calculations';

interface WealthChartDataPoint {
	year: number;
	month: number;
	label: string;
	cashFlow: number;
	equity: number;
	appreciation: number;
	portfolioGrowth: number; // Extra growth from reinvesting cash flow (portfolio value - contributions)
	total: number;
}

interface WealthChartProps {
	data: ChartDataPoint[];
	mortgageTermYears: number;
	language: 'en' | 'he';
	translations: {
		wealthOverTime: string;
		accumulatedCashFlow: string;
		accumulatedEquity: string;
		accumulatedAppreciation: string;
		portfolioGrowth: string;
		year: string;
	};
	initialMarketValue: number;
	loanAmount: number;
	downPayment: number;
	cashFlowReinvestmentRate: number; // When > 0, show the portfolio growth layer
}

const COLORS = {
	cashFlow: '#f59e0b', // Amber
	equity: '#0ea5e9', // Sky
	appreciation: '#10b981', // Emerald
	portfolioGrowth: '#8b5cf6', // Violet - for reinvested cash flow growth
	grid: '#e5e7eb',
	text: '#6b7280',
};

export const WealthChart = memo(function WealthChart({
	data,
	mortgageTermYears,
	language,
	translations: t,
	initialMarketValue,
	loanAmount,
	downPayment,
	cashFlowReinvestmentRate,
}: WealthChartProps) {
	// CFRI: Determine if we should show the portfolio growth layer
	const showPortfolioGrowth_CFRI = cashFlowReinvestmentRate > 0;

	// Transform data to monthly wealth breakdown
	const wealthData = useMemo(() => {
		const monthlyData: WealthChartDataPoint[] = [];

		// Process all monthly data points
		for (const point of data) {
			// Cash flow: cumulative cash flow (positive portion for wealth)
			// Note: cumulativeCashFlow starts negative due to closing costs
			const cashFlow = Math.max(0, point.cumulativeCashFlow);

			// Equity from principal paydown (what tenants have paid off)
			const principalPaid = loanAmount - point.mortgageBalance;
			const equity = Math.max(0, principalPaid);

			// Appreciation: property value growth above initial value
			const appreciation = Math.max(
				0,
				point.propertyValue - initialMarketValue
			);

			// CFRI: Portfolio growth - the EXTRA value from reinvesting vs just accumulating
			// This is: portfolioValue - cumulativeCashFlow (what you'd have without reinvesting)
			// Shows the incremental benefit of enabling CFRI
			let portfolioGrowth_CFRI = 0;
			if (showPortfolioGrowth_CFRI && point.portfolioValue_CFRI > 0) {
				// Portfolio growth = total portfolio value - what you'd have without reinvesting
				portfolioGrowth_CFRI = Math.max(
					0,
					point.portfolioValue_CFRI - cashFlow
				);
			}

			monthlyData.push({
				year: point.year + (point.month % 12) / 12, // For x-axis positioning
				month: point.month,
				label: point.label,
				cashFlow: Math.round(cashFlow),
				equity: Math.round(equity),
				appreciation: Math.round(appreciation),
				portfolioGrowth: Math.round(portfolioGrowth_CFRI),
				total: Math.round(cashFlow + equity + appreciation + portfolioGrowth_CFRI),
			});
		}

		return monthlyData;
	}, [data, loanAmount, initialMarketValue, showPortfolioGrowth_CFRI]);

	const CustomTooltip = useMemo(() => {
		return function TooltipContent({ active, payload }: any) {
			if (!active || !payload?.length) return null;

			const point = payload[0]?.payload as WealthChartDataPoint;
			if (!point) return null;

			const yearNum = Math.floor(point.month / 12) + 1;
			const monthNum = (point.month % 12) + 1;

			return (
				<div
					className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700
                     rounded-xl shadow-xl p-4 text-sm min-w-[200px]"
					dir={language === 'he' ? 'rtl' : 'ltr'}
				>
					<p className="font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b">
						{t.year} {yearNum}, {language === 'he' ? 'חודש' : 'Month'} {monthNum}
					</p>

					<div className="space-y-2">
						<div className="flex justify-between">
							<span style={{ color: COLORS.appreciation }}>
								● {t.accumulatedAppreciation}
							</span>
							<span className="font-mono">
								{formatAxisValue(point.appreciation)}
							</span>
						</div>

						<div className="flex justify-between">
							<span style={{ color: COLORS.equity }}>
								● {t.accumulatedEquity}
							</span>
							<span className="font-mono">
								{formatAxisValue(point.equity)}
							</span>
						</div>

						<div className="flex justify-between">
							<span style={{ color: COLORS.cashFlow }}>
								● {t.accumulatedCashFlow}
							</span>
							<span className="font-mono">
								{formatAxisValue(point.cashFlow)}
							</span>
						</div>

						{/* CFRI: Only show portfolio growth if reinvestment is enabled */}
						{showPortfolioGrowth_CFRI && point.portfolioGrowth > 0 && (
							<div className="flex justify-between">
								<span style={{ color: COLORS.portfolioGrowth }}>
									● {t.portfolioGrowth}
								</span>
								<span className="font-mono">
									{formatAxisValue(point.portfolioGrowth)}
								</span>
							</div>
						)}

						<div className="border-t pt-2 mt-2 flex justify-between font-bold">
							<span className="text-gray-700 dark:text-gray-300">
								Total
							</span>
							<span className="text-violet-600 dark:text-violet-400">
								{formatAxisValue(point.total)}
							</span>
						</div>
					</div>
				</div>
			);
		};
	}, [language, t, showPortfolioGrowth_CFRI]);

	return (
		<div className="w-full h-[350px]">
			<ResponsiveContainer width="100%" height="100%">
				<AreaChart
					data={wealthData}
					margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
				>
					<CartesianGrid
						strokeDasharray="3 3"
						stroke={COLORS.grid}
						opacity={0.5}
					/>

					<XAxis
						dataKey="label"
						tick={{ fill: COLORS.text, fontSize: 12 }}
						tickLine={false}
						axisLine={{ stroke: COLORS.grid }}
						tickFormatter={(label: string) => {
							// Only show labels for year boundaries
							const year = parseInt(label.split('.')[0]);
							const month = label.split('.')[1];
							if ([1, 5, 10, 15, 20, 25, 30].includes(year) && month === '01') {
								return `${year}`;
							}
							return '';
						}}
						interval={11}
						label={{
							value: language === 'he' ? 'שנים' : 'Years',
							position: 'insideBottom',
							offset: -5,
							fill: COLORS.text,
							fontSize: 12,
						}}
					/>

					<YAxis
						tickFormatter={formatAxisValue}
						tick={{ fill: COLORS.text, fontSize: 12 }}
						tickLine={false}
						axisLine={{ stroke: COLORS.grid }}
						width={60}
					/>

					<Tooltip content={<CustomTooltip />} />

					<Legend
						verticalAlign="top"
						height={36}
						iconType="circle"
						iconSize={8}
						formatter={(value) => (
							<span className="text-gray-600 dark:text-gray-400 text-xs ms-1">
								{value}
							</span>
						)}
					/>

					{/* Stacked areas - order matters for visual layering */}
					<Area
						type="monotone"
						dataKey="appreciation"
						name={t.accumulatedAppreciation}
						stackId="1"
						stroke={COLORS.appreciation}
						fill={COLORS.appreciation}
						fillOpacity={0.6}
						isAnimationActive={false}
					/>
					<Area
						type="monotone"
						dataKey="equity"
						name={t.accumulatedEquity}
						stackId="1"
						stroke={COLORS.equity}
						fill={COLORS.equity}
						fillOpacity={0.6}
						isAnimationActive={false}
					/>
					<Area
						type="monotone"
						dataKey="cashFlow"
						name={t.accumulatedCashFlow}
						stackId="1"
						stroke={COLORS.cashFlow}
						fill={COLORS.cashFlow}
						fillOpacity={0.6}
						isAnimationActive={false}
					/>
					{/* CFRI: Portfolio growth layer - only shown when cash flow reinvestment is enabled */}
					{showPortfolioGrowth_CFRI && (
						<Area
							type="monotone"
							dataKey="portfolioGrowth"
							name={t.portfolioGrowth}
							stackId="1"
							stroke={COLORS.portfolioGrowth}
							fill={COLORS.portfolioGrowth}
							fillOpacity={0.6}
							isAnimationActive={false}
						/>
					)}
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
});
