/**
 * Real Estate Calculator V2 - Projection Chart Component
 * 
 * Displays a 30-year property projection with dual Y-axis:
 * - Left axis: Property values (property value, equity, mortgage balance, net worth)
 * - Right axis: Monthly rent
 * 
 * Features:
 * - Click legend items to toggle line visibility
 * - Performance optimized with memoization and disabled animations
 */

'use client';

import React, { memo, useMemo, useState, useCallback } from 'react';
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { ChartDataPoint } from '../types';
import { formatAxisValue } from '../utils/calculations';

interface ProjectionChartProps {
  data: ChartDataPoint[];
  mortgageTermYears: number;
  language: 'en' | 'he';
  translations: any;
}

const COLORS = {
  propertyValue: '#10b981',
  equity: '#f59e0b',
  mortgageBalance: '#f87171',
  monthlyRent: '#3b82f6',
  netWorth: '#8b5cf6',
  grid: '#e5e7eb',
  text: '#6b7280',
};

// Data keys that can be toggled
type ToggleableKey = 'propertyValue' | 'equity' | 'mortgageBalance' | 'monthlyRent' | 'netWorth';

export const ProjectionChart = memo(function ProjectionChart({ 
  data, 
  mortgageTermYears,
  language,
  translations: t,
}: ProjectionChartProps) {
  // Track which lines are hidden (toggled off via legend)
  const [hiddenLines, setHiddenLines] = useState<Set<ToggleableKey>>(new Set());
  
  // Toggle line visibility when legend item is clicked
  const handleLegendClick = useCallback((dataKey: string) => {
    setHiddenLines(prev => {
      const newSet = new Set(prev);
      if (newSet.has(dataKey as ToggleableKey)) {
        newSet.delete(dataKey as ToggleableKey);
      } else {
        newSet.add(dataKey as ToggleableKey);
      }
      return newSet;
    });
  }, []);
  
  const formatYAxisRight = (value: number) => `$${value.toLocaleString()}`;
  
  const formatXAxis = (label: string) => {
    const year = parseInt(label.split('.')[0]);
    const month = label.split('.')[1];
    if ([1, 5, 10, 15, 20, 25, 30].includes(year) && month === '01') {
      return `${year}`;
    }
    return '';
  };
  
  // Check if a line is visible
  const isVisible = (key: ToggleableKey) => !hiddenLines.has(key);
  
  const CustomTooltip = useMemo(() => {
    return function Tooltip({ active, payload }: any) {
      if (!active || !payload?.length) return null;
      
      const point = payload[0]?.payload as ChartDataPoint;
      if (!point) return null;
      
      return (
        <div 
          className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 
                     rounded-xl shadow-xl p-4 text-sm min-w-[220px]"
          dir={language === 'he' ? 'rtl' : 'ltr'}
        >
          <p className="font-bold text-gray-900 dark:text-white mb-3 pb-2 border-b">
            {t.year} {point.year}, {t.month} {(point.month % 12) + 1}
          </p>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span style={{ color: COLORS.propertyValue }}>● {t.propertyValue}</span>
              <span className="font-mono">{formatAxisValue(point.propertyValue)}</span>
            </div>
            
            <div className="flex justify-between">
              <span style={{ color: COLORS.equity }}>● {t.equity}</span>
              <span className="font-mono">{formatAxisValue(point.equity)}</span>
            </div>
            
            <div className="flex justify-between">
              <span style={{ color: COLORS.mortgageBalance }}>○ {t.mortgageBalance}</span>
              <span className="font-mono">{formatAxisValue(point.mortgageBalance)}</span>
            </div>
            
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between">
                <span style={{ color: COLORS.monthlyRent }}>● {t.rent}</span>
                <span className="font-mono">${point.monthlyRent.toFixed(0)}{t.perMonth}</span>
              </div>
              
              <div className="flex justify-between text-gray-500 mt-1">
                <span>{t.tooltipNetCashFlow}</span>
                <span className={`font-mono ${point.monthlyCashFlow >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                  ${point.monthlyCashFlow.toFixed(0)}{t.perMonth}
                </span>
              </div>
            </div>
            
            <div className="border-t pt-2 mt-2 flex justify-between font-medium bg-violet-50 dark:bg-violet-950/30 -mx-4 px-4 py-2 rounded-b-xl">
              <span className="text-violet-700 dark:text-violet-300">{t.netWorth}</span>
              <span className="text-violet-700 dark:text-violet-300 font-bold">
                {formatAxisValue(point.cumulativeCashFlow + point.propertyValue - point.mortgageBalance)}
              </span>
            </div>
          </div>
        </div>
      );
    };
  }, [language, t]);

  return (
    <div className="w-full h-[400px] md:h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 20, right: 60, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={COLORS.grid} opacity={0.5} />
          
          <XAxis
            dataKey="label"
            tickFormatter={formatXAxis}
            tick={{ fill: COLORS.text, fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: COLORS.grid }}
            interval={11}
          />
          
          {/* Left Y Axis - Property Values */}
          <YAxis
            yAxisId="left"
            tickFormatter={formatAxisValue}
            tick={{ fill: COLORS.text, fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: COLORS.grid }}
            width={60}
          />
          
          {/* Right Y Axis - Rent Values */}
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={formatYAxisRight}
            tick={{ fill: COLORS.text, fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: COLORS.grid }}
            width={70}
            domain={['dataMin - 200', 'dataMax + 500']}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend 
            verticalAlign="top" 
            height={36} 
            iconType="circle" 
            iconSize={8}
            onClick={(e) => {
              if (e.dataKey) {
                handleLegendClick(e.dataKey as string);
              }
            }}
            formatter={(value, entry) => {
              const dataKey = entry.dataKey as ToggleableKey;
              const isHidden = hiddenLines.has(dataKey);
              return (
                <span 
                  style={{ 
                    color: isHidden ? '#9ca3af' : entry.color,
                    textDecoration: isHidden ? 'line-through' : 'none',
                    cursor: 'pointer',
                  }}
                >
                  {value}
                </span>
              );
            }}
          />
          
          {/* Mortgage end reference line */}
          <ReferenceLine
            x={`${mortgageTermYears}.01`}
            yAxisId="left"
            stroke="#9ca3af"
            strokeDasharray="5 5"
            strokeWidth={2}
            label={{ value: language === 'he' ? 'משכנתא נפרעה' : 'Paid Off', position: 'top' }}
          />
          
          {/* Property Value */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="propertyValue"
            name={t.propertyValue}
            stroke={COLORS.propertyValue}
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
            hide={!isVisible('propertyValue')}
          />
          
          {/* Equity - filled area */}
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="equity"
            name={t.equity}
            stroke={COLORS.equity}
            fill={COLORS.equity}
            fillOpacity={isVisible('equity') ? 0.15 : 0}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            hide={!isVisible('equity')}
          />
          
          {/* Net Worth - purple line */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="netWorth"
            name={t.netWorth}
            stroke={COLORS.netWorth}
            strokeWidth={3}
            dot={false}
            isAnimationActive={false}
            hide={!isVisible('netWorth')}
          />
          
          {/* Mortgage Balance - dashed */}
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="mortgageBalance"
            name={t.mortgageBalance}
            stroke={COLORS.mortgageBalance}
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            isAnimationActive={false}
            hide={!isVisible('mortgageBalance')}
          />
          
          {/* Monthly Rent */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="monthlyRent"
            name={t.rent}
            stroke={COLORS.monthlyRent}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
            hide={!isVisible('monthlyRent')}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
});

