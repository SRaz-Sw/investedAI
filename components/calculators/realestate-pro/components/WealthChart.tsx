/**
 * Real Estate Calculator Pro - Wealth Building Chart Component
 *
 * Displays a stacked area chart showing wealth accumulation over time
 * broken down by the 3 engines of profit:
 * - Cash Flow (accumulated rental income)
 * - Equity Built (principal paydown)
 * - Appreciation (property value growth)
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
	cashFlow: number;
	equity: number;
	appreciation: number;
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
		year: string;
	};
	initialMarketValue: number;
	loanAmount: number;
	downPayment: number;
}

const COLORS = {
	cashFlow: '#f59e0b', // Amber
	equity: '#0ea5e9', // Sky
	appreciation: '#10b981', // Emerald
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
}: WealthChartProps) {
	// Transform monthly data to yearly wealth breakdown
	const wealthData = useMemo(() => {
		const yearlyData: WealthChartDataPoint[] = [];

		// Process data at year boundaries (month % 12 === 0)
		for (let year = 0; year <= mortgageTermYears; year++) {
			const monthIndex = year * 12;
			const point = data.find((d) => d.month === monthIndex);

			if (point) {
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

				yearlyData.push({
					year,
					cashFlow: Math.round(cashFlow),
					equity: Math.round(equity),
					appreciation: Math.round(appreciation),
					total: Math.round(cashFlow + equity + appreciation),
				});
			}
		}

		return yearlyData;
	}, [data, mortgageTermYears, loanAmount, initialMarketValue]);

	const CustomTooltip = useMemo(() => {
		return function TooltipContent({ active, payload }: any) {
			if (!active || !payload?.length) return null;

			const point = payload[0]?.payload as WealthChartDataPoint;
			if (!point) return null;

			return (
				<div
					className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700
                     rounded-xl shadow-xl p-4 text-sm min-w-[200px]"
					dir={language === 'he' ? 'rtl' : 'ltr'}
				>
					<p className="font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b">
						{t.year} {point.year}
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
	}, [language, t]);

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
						dataKey="year"
						tick={{ fill: COLORS.text, fontSize: 12 }}
						tickLine={false}
						axisLine={{ stroke: COLORS.grid }}
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
				</AreaChart>
			</ResponsiveContainer>
		</div>
	);
});
