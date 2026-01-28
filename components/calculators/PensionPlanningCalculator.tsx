'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { CustomInterestSlider } from '@/components/ui/slider-w-landmarks';
import { SliderWithInput } from '@/components/ui/slider-w-input';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useTranslationStore } from '@/lib/translations';
import { pensionTranslations } from '@/lib/translations/pension';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useCurrencyFormatter } from '@/lib/hooks/useCurrencyFormatter';

// Define slider info keys type
type SliderInfoKeys = 
  | 'initialPortfolio'
  | 'monthlyWithdrawal'
  | 'portfolioReturn';

interface HelpButtonProps {
  sliderKey: SliderInfoKeys;
}

interface CalculatorInputs {
  initialPortfolio: number;
  monthlyWithdrawal: number;
  portfolioReturn: number;
}

export function PensionPlanningCalculator() {
  const { language, direction, formatCurrency } = useTranslationStore();
  const { abbreviateNumber, formatCurrencySafe } = useCurrencyFormatter();
  const t = pensionTranslations[language];
  const [mounted, setMounted] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 768);
  
  // Add drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState({ title: '', description: '' });

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const [inputs, setInputs] = useState<CalculatorInputs>({
    initialPortfolio: 1000000,
    monthlyWithdrawal: 5000,
    portfolioReturn: 7,
  });

  // Add openInfoDrawer function
  const openInfoDrawer = (title: string, description: string): void => {
    setDrawerContent({ title, description });
    setDrawerOpen(true);
  };

  // Add sliderInfo object
  const sliderInfo: Record<SliderInfoKeys, { title: string; description: string }> = {
    initialPortfolio: {
      title: t.initialPortfolio_info,
      description: t.initialPortfolio_desc,
    },
    monthlyWithdrawal: {
      title: t.monthlyWithdrawal_info,
      description: t.monthlyWithdrawal_desc,
    },
    portfolioReturn: {
      title: t.portfolioReturn_info,
      description: t.portfolioReturn_desc,
    },
  };

  // Add HelpButton component
  const HelpButton: React.FC<HelpButtonProps> = ({ sliderKey }) => (
    <Button
      variant="ghost"
      size="icon"
      className="h-5 w-5 rounded-full bg-transparent hover:bg-white/30 dark:hover:bg-black/30 transition-all shadow-sm backdrop-blur-sm p-0 ms-2"
      onClick={(e) => {
        e.stopPropagation();
        openInfoDrawer(sliderInfo[sliderKey].title, sliderInfo[sliderKey].description);
      }}
    >
      <HelpCircle className="h-3.5 w-3.5 text-emerald-700/90 dark:text-emerald-400/90 transition-colors" />
    </Button>
  );

  const parseInputValue = useCallback((value: string): number => {
    const parsed = Number(value.replace(/[^0-9.-]+/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  }, []);

  const calculateProjections = () => {
    const data = [];
    const years = 50; // Extended to 50-year projection
    let currentPortfolio = inputs.initialPortfolio;
    let depletionYear = -1;

    for (let year = 0; year <= years; year++) {
      data.push({
        year,
        portfolioValue: Math.max(0, currentPortfolio),
      });

      // Update for next year
      const annualWithdrawal = inputs.monthlyWithdrawal * 12;
      currentPortfolio = Math.max(
        0,
        (currentPortfolio - annualWithdrawal) *
          (1 + inputs.portfolioReturn / 100)
      );

      // Check for depletion
      if (currentPortfolio === 0 && depletionYear === -1) {
        depletionYear = year;
      }
    }

    return {
      data,
      depletionYear,
      finalValue: data[data.length - 1].portfolioValue,
    };
  };

  const {
    data: projectionData,
    depletionYear,
    finalValue,
  } = calculateProjections();
  const isSustainable = depletionYear === -1;

  // Calculate annual withdrawal rate
  const annualWithdrawalRate =
    ((inputs.monthlyWithdrawal * 12) / inputs.initialPortfolio) * 100;

  // Update the Tooltip formatter to use formatCurrencySafe
  const tooltipFormatter = useCallback((value: number | undefined) => {
    if (value === undefined) return ['', ''];
    return [formatCurrencySafe(value), t.portfolioValue];
  }, [formatCurrencySafe, t.portfolioValue]);

  if (!mounted) {
    return (
      <div suppressHydrationWarning className="space-y-8" dir={direction()} />
    );
  }

  return (
    <div suppressHydrationWarning className="font-sans p-4 md:p-8 flex flex-col justify-center items-center" dir={direction()}>
      <Card className="w-full max-w-7xl overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-zinc-900/70 rounded-3xl mb-8">
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-100/30 via-transparent to-emerald-100/30 dark:from-zinc-900/20 dark:to-emerald-900/20 rounded-3xl"></div>
        <CardContent className="space-y-8 p-8 relative z-10">
          {/* Header */}
          <div className="text-center space-y-3 mb-10">
            <h1 className="text-3xl font-light tracking-tight bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent">
              {t.pensionPlanning}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">{t.planYourRetirement}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2 bg-gradient-to-br from-white/70 to-zinc-50/70 dark:from-zinc-800/70 dark:to-zinc-900/50 backdrop-blur-md p-4 rounded-xl border border-white/50 dark:border-zinc-700/30 shadow-md">
                <div className="flex items-center">
                  <Label className="text-gray-700 dark:text-gray-300">{`${t.initialPortfolio} (${t.currency})`}</Label>
                  <HelpButton sliderKey="initialPortfolio" />
                </div>
                <SliderWithInput
                  value={inputs.initialPortfolio}
                  onValueChange={(value) =>
                    setInputs({ ...inputs, initialPortfolio: value })
                  }
                  min={100000}
                  max={10000000}
                  step={50000}
                  formatValue={(value) => formatCurrencySafe(value).replace(/[^0-9,]/g, '')}
                />
              </div>

              <div className="space-y-2 bg-gradient-to-br from-white/70 to-zinc-50/70 dark:from-zinc-800/70 dark:to-zinc-900/50 backdrop-blur-md p-4 rounded-xl border border-white/50 dark:border-zinc-700/30 shadow-md">
                <div className="flex items-center">
                  <Label className="text-gray-700 dark:text-gray-300">{`${t.monthlyWithdrawal} (${t.currency})`}</Label>
                  <HelpButton sliderKey="monthlyWithdrawal" />
                </div>
                <SliderWithInput
                  value={inputs.monthlyWithdrawal}
                  onValueChange={(value) =>
                    setInputs({ ...inputs, monthlyWithdrawal: value })
                  }
                  min={1000}
                  max={50000}
                  step={500}
                  formatValue={(value) => formatCurrencySafe(value).replace(/[^0-9,]/g, '')}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2 bg-gradient-to-br from-white/70 to-zinc-50/70 dark:from-zinc-800/70 dark:to-zinc-900/50 backdrop-blur-md p-4 rounded-xl border border-white/50 dark:border-zinc-700/30 shadow-md">
                <div className="flex items-center" dir='ltr'>
                  <Label className="text-gray-700 dark:text-gray-300">{`${t.portfolioReturn}`}</Label>
                  <HelpButton sliderKey="portfolioReturn" />
                  <div className="text-sm text-gray-600 dark:text-gray-400 ml-auto">
                    {inputs.portfolioReturn.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                  </div>
                </div>
                <CustomInterestSlider
                  value={inputs.portfolioReturn}
                  onValueChange={(value) =>
                    setInputs({ ...inputs, portfolioReturn: value })
                  }
                  min={0}
                  max={20}
                  step={0.1}
                />
              </div>

              <div className="text-sm text-gray-600 dark:text-gray-400 mt-4 bg-gradient-to-br from-white/70 to-zinc-50/70 dark:from-zinc-800/70 dark:to-zinc-900/50 backdrop-blur-md p-4 rounded-xl border border-white/50 dark:border-zinc-700/30 shadow-sm">
                {t.withdrawalRate}: {annualWithdrawalRate.toFixed(1)}%
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <Card className="overflow-hidden border border-white/20 dark:border-white/10 shadow-lg backdrop-blur-md bg-white/90 dark:bg-zinc-900/80 rounded-2xl">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
                  {t.portfolioProjection}
                </h3>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                      data={projectionData.slice(0,30)}
                      margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                      <XAxis
                        dataKey="year"
                        tickLine={false}
                        axisLine={{ stroke: '#eaeaea' }}
                        tick={{ fill: '#888', fontSize: 12 }}
                        label={{
                          value: t.years,
                          position: 'insideBottom',
                          offset: -5,
                          fill: '#888',
                          fontSize: 12,
                        }}
                      />
                      <YAxis
                        tickFormatter={value => abbreviateNumber(value)}
                        tickLine={false}
                        axisLine={{ stroke: '#eaeaea' }}
                        tick={{ fill: '#888', fontSize: 12 }}
                        width={60}
                        label={windowWidth >= 640 ? {
                          value: t.portfolioValue,
                          angle: -90,
                          position: 'insideLeft',
                          fill: '#888',
                          fontSize: 12,
                        } : undefined}
                      />
                      <Tooltip
                        formatter={tooltipFormatter}
                        contentStyle={{
                          backgroundColor: 'hsl(var(--background) / 0.95)',
                          borderRadius: '8px',
                          border: '1px solid hsl(var(--border) / 0.2)',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          padding: '8px 12px',
                          color: 'hsl(var(--foreground))',
                        }}
                        labelFormatter={(year) => (
                          <span style={{ color: 'hsl(var(--foreground) / 0.7)', fontSize: '0.875rem' }}>
                            {t.years} {year}
                          </span>
                        )}
                      />
                      <Line
                        type="monotone"
                        dataKey="portfolioValue"
                        name={t.portfolioValue}
                        stroke="hsl(var(--chart-1))"
                        strokeWidth={3}
                        dot={{ r: 1 }}
                        activeDot={{ r: 5, strokeWidth: 0 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className="overflow-hidden border border-white/20 dark:border-white/10 shadow-lg backdrop-blur-md bg-white/90 dark:bg-zinc-900/80 rounded-2xl">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
                  {t.portfolioDepletion}
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 p-4 bg-gradient-to-br from-white/70 to-zinc-50/70 dark:from-zinc-800/70 dark:to-zinc-900/50 backdrop-blur-md rounded-xl border border-white/50 dark:border-zinc-700/30 shadow-sm">
                    {isSustainable ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500 dark:text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-500 dark:text-amber-400" />
                    )}
                    <span className="font-medium text-gray-800 dark:text-gray-200">
                      {isSustainable
                        ? `${t.indefinitelySustainable} ${formatCurrency(
                            finalValue
                          )}`
                        : `${t.depleteInYear} ${depletionYear}`}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
      
      {/* Info Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>{drawerContent.title}</DrawerTitle>
            <DrawerDescription>{drawerContent.description}</DrawerDescription>
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