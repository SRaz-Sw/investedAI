'use client';

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle, 
  Home, 
  TrendingUp, 
  Wallet, 
  Building2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Target,
  Zap
} from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useTranslationStore } from '@/lib/translations';
import { realEstateTranslations } from '@/lib/translations/realestate';
import { SliderWithInput } from '@/components/ui/slider-w-input';
import { useCurrencyFormatter } from '@/lib/hooks/useCurrencyFormatter';

// Types
type SliderInfoKeys =
  | 'propertyValue'
  | 'downPayment'
  | 'monthlyRent'
  | 'appreciation'
  | 'mortgageRate'
  | 'mortgageTerm'
  | 'rentGrowth'
  | 'operatingCosts';

interface ChartDataPoint {
  year: number;
  cashFlow: number;
  equity: number;
  appreciation: number;
  total: number;
}

interface CrossoverDataPoint {
  year: number;
  rent: number;
  mortgage: number;
  cashFlow: number;
}

interface Milestone {
  year: number;
  cashFlow: number;
  status: 'tight' | 'comfortable' | 'strong' | 'paid';
}

// Custom hook for window size
const useWindowSize = () => {
  const [width, setWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 768
  );

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
};

export function RealEstateCalculator() {
  const { language, direction } = useTranslationStore();
  const { formatCurrencySafe, abbreviateNumber } = useCurrencyFormatter();
  const t = realEstateTranslations[language];
  const [mounted, setMounted] = useState(false);
  const windowWidth = useWindowSize();

  // ===== SIMPLE INPUTS =====
  const [propertyValue, setPropertyValue] = useState(500000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(25);
  const [monthlyRent, setMonthlyRent] = useState(2500);
  const [appreciation, setAppreciation] = useState(3);

  // ===== ADVANCED INPUTS =====
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [mortgageRate, setMortgageRate] = useState(4.5);
  const [mortgageTerm, setMortgageTerm] = useState(30);
  const [rentGrowth, setRentGrowth] = useState(2.5);
  const [operatingCostsPercent, setOperatingCostsPercent] = useState(1.5);

  // Drawer state
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerContent, setDrawerContent] = useState({ title: '', description: '' });

  useEffect(() => {
    setMounted(true);
  }, []);

  // ===== DERIVED CALCULATIONS =====
  const downPayment = useMemo(() => 
    (propertyValue * downPaymentPercent) / 100, 
    [propertyValue, downPaymentPercent]
  );
  
  const loanAmount = useMemo(() => 
    propertyValue - downPayment, 
    [propertyValue, downPayment]
  );

  const monthlyMortgagePayment = useMemo(() => {
    const monthlyRate = mortgageRate / 100 / 12;
    const numPayments = mortgageTerm * 12;
    if (monthlyRate === 0) return loanAmount / numPayments;
    return (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numPayments)) /
      (Math.pow(1 + monthlyRate, numPayments) - 1);
  }, [loanAmount, mortgageRate, mortgageTerm]);

  const annualOperatingCosts = useMemo(() => 
    (propertyValue * operatingCostsPercent) / 100,
    [propertyValue, operatingCostsPercent]
  );

  // ===== PILLAR 1: CASH FLOW CALCULATIONS =====
  const cashFlowData = useMemo(() => {
    const monthlyOps = annualOperatingCosts / 12;
    
    // Today's cash flow
    const todayCashFlow = monthlyRent - monthlyMortgagePayment - monthlyOps;
    
    // Cash flow at different years (rent grows, mortgage stays fixed)
    const cashFlowAtYear = (year: number) => {
      const futureRent = monthlyRent * Math.pow(1 + rentGrowth / 100, year);
      const futureOps = monthlyOps * Math.pow(1 + rentGrowth / 100, year); // Ops grow with inflation
      if (year >= mortgageTerm) {
        return futureRent - futureOps; // No mortgage after term
      }
      return futureRent - monthlyMortgagePayment - futureOps;
    };

    return {
      today: todayCashFlow,
      year10: cashFlowAtYear(10),
      yearEnd: cashFlowAtYear(mortgageTerm),
    };
  }, [monthlyRent, monthlyMortgagePayment, annualOperatingCosts, rentGrowth, mortgageTerm]);

  // ===== PILLAR 2: EQUITY BUILDING (Mortgage paydown per month) =====
  const equityBuildingPerMonth = useMemo(() => {
    // First month's principal payment
    const monthlyRate = mortgageRate / 100 / 12;
    const interestPayment = loanAmount * monthlyRate;
    return monthlyMortgagePayment - interestPayment;
  }, [loanAmount, mortgageRate, monthlyMortgagePayment]);

  // ===== PILLAR 3: APPRECIATION =====
  const appreciationPerMonth = useMemo(() => 
    (propertyValue * appreciation / 100) / 12,
    [propertyValue, appreciation]
  );

  // ===== CUMULATIVE WEALTH CHART DATA =====
  const wealthChartData = useMemo(() => {
    const data: ChartDataPoint[] = [];
    const monthlyRate = mortgageRate / 100 / 12;
    let remainingLoan = loanAmount;
    let accumulatedCashFlow = 0;
    let accumulatedEquity = 0;
    const monthlyOps = annualOperatingCosts / 12;

    for (let year = 0; year <= mortgageTerm; year++) {
      // Property appreciation
      const currentPropertyValue = propertyValue * Math.pow(1 + appreciation / 100, year);
      const totalAppreciation = currentPropertyValue - propertyValue;

      // Equity from mortgage (property value - remaining loan)
      accumulatedEquity = loanAmount - remainingLoan;

      data.push({
        year,
        cashFlow: Math.round(accumulatedCashFlow),
        equity: Math.round(accumulatedEquity),
        appreciation: Math.round(totalAppreciation),
        total: Math.round(accumulatedCashFlow + accumulatedEquity + totalAppreciation),
      });

      // Calculate this year's cash flow and add to accumulated
      const futureRent = monthlyRent * Math.pow(1 + rentGrowth / 100, year);
      const futureOps = monthlyOps * Math.pow(1 + rentGrowth / 100, year);
      const yearCashFlow = year < mortgageTerm 
        ? (futureRent - monthlyMortgagePayment - futureOps) * 12
        : (futureRent - futureOps) * 12;
      accumulatedCashFlow += Math.max(0, yearCashFlow);

      // Pay down mortgage for next year
      for (let month = 0; month < 12 && remainingLoan > 0; month++) {
        const interestPayment = remainingLoan * monthlyRate;
        const principalPayment = monthlyMortgagePayment - interestPayment;
        remainingLoan = Math.max(0, remainingLoan - principalPayment);
      }
    }

    return data;
  }, [propertyValue, loanAmount, mortgageRate, mortgageTerm, appreciation, monthlyRent, rentGrowth, annualOperatingCosts]);

  // ===== CROSSOVER CHART DATA (Rent vs Mortgage) =====
  const crossoverChartData = useMemo(() => {
    const data: CrossoverDataPoint[] = [];
    const monthlyOps = annualOperatingCosts / 12;

    for (let year = 0; year <= mortgageTerm; year++) {
      const futureRent = monthlyRent * Math.pow(1 + rentGrowth / 100, year);
      const futureOps = monthlyOps * Math.pow(1 + rentGrowth / 100, year);
      const totalExpenses = year < mortgageTerm 
        ? monthlyMortgagePayment + futureOps 
        : futureOps;

      data.push({
        year,
        rent: Math.round(futureRent),
        mortgage: Math.round(totalExpenses),
        cashFlow: Math.round(futureRent - totalExpenses),
      });
    }

    return data;
  }, [monthlyRent, monthlyMortgagePayment, mortgageTerm, rentGrowth, annualOperatingCosts]);

  // ===== MILESTONES =====
  const milestones = useMemo((): Milestone[] => {
    const getStatus = (cashFlow: number, year: number): Milestone['status'] => {
      if (year >= mortgageTerm) return 'paid';
      if (cashFlow >= monthlyMortgagePayment * 0.5) return 'strong';
      if (cashFlow >= 0) return 'comfortable';
      return 'tight';
    };

    const years = [1, 5, 10, Math.min(20, mortgageTerm), mortgageTerm];
    return years.map(year => {
      const dataPoint = crossoverChartData.find(d => d.year === year) || crossoverChartData[year];
      return {
        year,
        cashFlow: dataPoint?.cashFlow || 0,
        status: getStatus(dataPoint?.cashFlow || 0, year),
      };
    }).filter((m, i, arr) => arr.findIndex(x => x.year === m.year) === i);
  }, [crossoverChartData, mortgageTerm, monthlyMortgagePayment]);

  // ===== SUMMARY CALCULATIONS =====
  const summary = useMemo(() => {
    const finalData = wealthChartData[wealthChartData.length - 1];
    const totalWealth = finalData.total;
    const totalROI = ((totalWealth) / downPayment) * 100;
    const annualizedROI = (Math.pow(1 + totalWealth / downPayment, 1 / mortgageTerm) - 1) * 100;
    
    // Leverage calculation
    const annualAppreciationDollars = propertyValue * appreciation / 100;
    const leverageReturn = (annualAppreciationDollars / downPayment) * 100;

    return {
      totalWealth,
      totalROI,
      annualizedROI,
      leverageReturn,
      annualAppreciationDollars,
      finalCashFlow: finalData.cashFlow,
      finalEquity: finalData.equity,
      finalAppreciation: finalData.appreciation,
    };
  }, [wealthChartData, downPayment, mortgageTerm, propertyValue, appreciation]);

  // ===== HELPER FUNCTIONS =====
  const openInfoDrawer = (title: string, description: string): void => {
    setDrawerContent({ title, description });
    setDrawerOpen(true);
  };

  const sliderInfo: Record<SliderInfoKeys, { title: string; description: string }> = {
    propertyValue: { title: t.propertyValue_info, description: t.propertyValue_desc },
    downPayment: { title: t.downPayment_info, description: t.downPayment_desc },
    monthlyRent: { title: t.monthlyRent_info, description: t.monthlyRent_desc },
    appreciation: { title: t.appreciation_info, description: t.appreciation_desc },
    mortgageRate: { title: t.mortgageRate_info, description: t.mortgageRate_desc },
    mortgageTerm: { title: t.mortgageTerm_info, description: t.mortgageTerm_desc },
    rentGrowth: { title: t.rentGrowth_info, description: t.rentGrowth_desc },
    operatingCosts: { title: t.operatingCosts_info, description: t.operatingCosts_desc },
  };

  const HelpButton = ({ sliderKey }: { sliderKey: SliderInfoKeys }) => (
    <Button
      variant="ghost"
      size="icon"
      className="h-5 w-5 rounded-full bg-transparent hover:bg-white/30 dark:hover:bg-black/30 transition-all shadow-sm backdrop-blur-sm p-0 ms-2"
      onClick={(e) => {
        e.stopPropagation();
        openInfoDrawer(sliderInfo[sliderKey].title, sliderInfo[sliderKey].description);
      }}
    >
      <HelpCircle className="h-3.5 w-3.5 text-sky-700/90 dark:text-sky-400/90 transition-colors" />
    </Button>
  );

  const roundNumber = useCallback((value: number): number => {
    if (Math.abs(value) >= 1000000) return Math.round(value / 1000) * 1000;
    if (Math.abs(value) >= 10000) return Math.round(value / 100) * 100;
    return Math.round(value / 10) * 10;
  }, []);

  const getMilestoneColor = (status: Milestone['status']) => {
    switch (status) {
      case 'tight': return 'text-amber-600 dark:text-amber-400';
      case 'comfortable': return 'text-sky-600 dark:text-sky-400';
      case 'strong': return 'text-emerald-600 dark:text-emerald-400';
      case 'paid': return 'text-violet-600 dark:text-violet-400';
    }
  };

  const getMilestoneLabel = (status: Milestone['status']) => {
    switch (status) {
      case 'tight': return t.tight;
      case 'comfortable': return t.comfortable;
      case 'strong': return t.strong;
      case 'paid': return t.mortgagePaidOff;
    }
  };

  if (!mounted) return null;

  return (
    <div className="font-sans p-4 md:p-8 min-h-screen flex flex-col justify-center items-center" dir={direction()}>
      <Card className="w-full max-w-7xl overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-zinc-900/70 rounded-3xl mb-8">
        <div className="absolute inset-0 bg-gradient-to-tr from-zinc-100/30 via-transparent to-sky-100/30 dark:from-zinc-900/20 dark:to-sky-900/20 rounded-3xl"></div>
        <CardContent className="space-y-6 md:space-y-8 p-4 md:p-8 relative z-10">
          
          {/* ===== HEADER ===== */}
          <div className="text-center space-y-3 mb-6">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Building2 className="w-8 h-8 text-sky-600 dark:text-sky-400" />
            </div>
            <h1 className="text-3xl font-light tracking-tight bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-zinc-100 dark:to-zinc-300 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-lg mx-auto">{t.subtitle}</p>
          </div>

          {/* ===== SIMPLE INPUTS (4 main sliders) ===== */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Property Value */}
            <div className="bg-gradient-to-br from-white/70 to-zinc-50/70 dark:from-zinc-800/70 dark:to-zinc-900/50 backdrop-blur-md p-4 rounded-xl border border-white/50 dark:border-zinc-700/30 shadow-md">
              <div className="flex items-center">
                <Label className="text-gray-700 dark:text-gray-300">{t.propertyValue}</Label>
                <HelpButton sliderKey="propertyValue" />
              </div>
              <div className="pt-2">
                <SliderWithInput
                  value={propertyValue}
                  onValueChange={setPropertyValue}
                  min={100000}
                  max={2000000}
                  step={10000}
                  formatValue={(v) => formatCurrencySafe(v).replace(/[^0-9,]/g, '')}
                />
              </div>
            </div>

            {/* Down Payment */}
            <div className="bg-gradient-to-br from-white/70 to-zinc-50/70 dark:from-zinc-800/70 dark:to-zinc-900/50 backdrop-blur-md p-4 rounded-xl border border-white/50 dark:border-zinc-700/30 shadow-md">
              <div className="flex items-center">
                <Label className="text-gray-700 dark:text-gray-300">{t.downPayment} (%)</Label>
                <HelpButton sliderKey="downPayment" />
              </div>
              <div className="pt-2">
                <SliderWithInput
                  value={downPaymentPercent}
                  onValueChange={setDownPaymentPercent}
                  min={10}
                  max={50}
                  step={5}
                  formatValue={(v) => `${v}%`}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                = {formatCurrencySafe(downPayment)}
              </p>
            </div>

            {/* Monthly Rent */}
            <div className="bg-gradient-to-br from-white/70 to-zinc-50/70 dark:from-zinc-800/70 dark:to-zinc-900/50 backdrop-blur-md p-4 rounded-xl border border-white/50 dark:border-zinc-700/30 shadow-md">
              <div className="flex items-center">
                <Label className="text-gray-700 dark:text-gray-300">{t.monthlyRent}</Label>
                <HelpButton sliderKey="monthlyRent" />
              </div>
              <div className="pt-2">
                <SliderWithInput
                  value={monthlyRent}
                  onValueChange={setMonthlyRent}
                  min={500}
                  max={10000}
                  step={100}
                  formatValue={(v) => formatCurrencySafe(v).replace(/[^0-9,]/g, '')}
                />
              </div>
            </div>

            {/* Appreciation */}
            <div className="bg-gradient-to-br from-white/70 to-zinc-50/70 dark:from-zinc-800/70 dark:to-zinc-900/50 backdrop-blur-md p-4 rounded-xl border border-white/50 dark:border-zinc-700/30 shadow-md">
              <div className="flex items-center">
                <Label className="text-gray-700 dark:text-gray-300">{t.appreciation}</Label>
                <HelpButton sliderKey="appreciation" />
              </div>
              <div className="pt-2">
                <SliderWithInput
                  value={appreciation}
                  onValueChange={setAppreciation}
                  min={0}
                  max={10}
                  step={0.5}
                  formatValue={(v) => `${v}%`}
                />
              </div>
            </div>
          </div>

          {/* ===== ADVANCED SETTINGS (Collapsible) ===== */}
          <Collapsible open={advancedOpen} onOpenChange={setAdvancedOpen}>
            <CollapsibleTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                {advancedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                {t.advancedSettings}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-xl border border-zinc-200/50 dark:border-zinc-700/30">
                {/* Mortgage Rate */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label className="text-sm text-gray-600 dark:text-gray-400">{t.mortgageRate}</Label>
                    <HelpButton sliderKey="mortgageRate" />
                  </div>
                  <SliderWithInput
                    value={mortgageRate}
                    onValueChange={setMortgageRate}
                    min={1}
                    max={12}
                    step={0.1}
                    formatValue={(v) => `${v.toFixed(1)}%`}
                  />
                </div>

                {/* Mortgage Term */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label className="text-sm text-gray-600 dark:text-gray-400">{t.mortgageTerm}</Label>
                    <HelpButton sliderKey="mortgageTerm" />
                  </div>
                  <SliderWithInput
                    value={mortgageTerm}
                    onValueChange={setMortgageTerm}
                    min={10}
                    max={30}
                    step={5}
                    formatValue={(v) => `${v} ${t.yearsLabel}`}
                  />
                </div>

                {/* Rent Growth */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label className="text-sm text-gray-600 dark:text-gray-400">{t.rentGrowth}</Label>
                    <HelpButton sliderKey="rentGrowth" />
                  </div>
                  <SliderWithInput
                    value={rentGrowth}
                    onValueChange={setRentGrowth}
                    min={0}
                    max={5}
                    step={0.5}
                    formatValue={(v) => `${v}%`}
                  />
                </div>

                {/* Operating Costs */}
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Label className="text-sm text-gray-600 dark:text-gray-400">{t.operatingCosts}</Label>
                    <HelpButton sliderKey="operatingCosts" />
                  </div>
                  <SliderWithInput
                    value={operatingCostsPercent}
                    onValueChange={setOperatingCostsPercent}
                    min={0.5}
                    max={3}
                    step={0.1}
                    formatValue={(v) => `${v.toFixed(1)}%`}
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* ===== THE 3 PILLARS ===== */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Pillar 1: Cash Flow */}
            <Card className="bg-gradient-to-br from-amber-50/80 to-amber-100/50 dark:from-amber-950/40 dark:to-amber-900/20 backdrop-blur-md border border-amber-200/50 dark:border-amber-800/30 shadow-lg overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-amber-200/50 dark:bg-amber-800/30">
                    <Wallet className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900 dark:text-amber-200">{t.cashFlow}</h3>
                    <p className="text-xs text-amber-700/70 dark:text-amber-400/70">{t.cashFlowDesc}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-amber-800/70 dark:text-amber-300/70">{t.today}</span>
                    <span className={`font-bold ${cashFlowData.today >= 0 ? 'text-amber-800 dark:text-amber-200' : 'text-red-600 dark:text-red-400'}`}>
                      {formatCurrencySafe(roundNumber(cashFlowData.today))}{t.perMonth}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-amber-800/70 dark:text-amber-300/70">{t.inYears.replace('{n}', '10')}</span>
                    <span className="font-bold text-amber-800 dark:text-amber-200">
                      {formatCurrencySafe(roundNumber(cashFlowData.year10))}{t.perMonth}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-amber-300/30 dark:border-amber-700/30">
                    <span className="text-sm text-amber-800/70 dark:text-amber-300/70">{t.afterMortgage}</span>
                    <span className="font-bold text-lg text-amber-900 dark:text-amber-100">
                      {formatCurrencySafe(roundNumber(cashFlowData.yearEnd))}{t.perMonth}
                    </span>
                  </div>
                  <div className="text-center pt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-amber-200/50 dark:bg-amber-800/30 text-amber-800 dark:text-amber-300">
                      {t.total}: {formatCurrencySafe(roundNumber(summary.finalCashFlow))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pillar 2: Equity Building */}
            <Card className="bg-gradient-to-br from-sky-50/80 to-sky-100/50 dark:from-sky-950/40 dark:to-sky-900/20 backdrop-blur-md border border-sky-200/50 dark:border-sky-800/30 shadow-lg overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-sky-200/50 dark:bg-sky-800/30">
                    <Home className="w-5 h-5 text-sky-700 dark:text-sky-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sky-900 dark:text-sky-200">{t.equityBuilding}</h3>
                    <p className="text-xs text-sky-700/70 dark:text-sky-400/70">{t.equityBuildingDesc}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-sky-800/70 dark:text-sky-300/70">{t.tenantPaysMortgage}</span>
                    <span className="font-bold text-sky-800 dark:text-sky-200">
                      {formatCurrencySafe(roundNumber(equityBuildingPerMonth))}{t.perMonth}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-sky-800/70 dark:text-sky-300/70">{t.perYear}</span>
                    <span className="font-bold text-sky-800 dark:text-sky-200">
                      {formatCurrencySafe(roundNumber(equityBuildingPerMonth * 12))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-sky-300/30 dark:border-sky-700/30">
                    <span className="text-sm text-sky-800/70 dark:text-sky-300/70">{t.afterMortgage}</span>
                    <span className="font-bold text-lg text-sky-900 dark:text-sky-100">
                      {formatCurrencySafe(roundNumber(loanAmount))}
                    </span>
                  </div>
                  <div className="text-center pt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-sky-200/50 dark:bg-sky-800/30 text-sky-800 dark:text-sky-300">
                      {t.total}: {formatCurrencySafe(roundNumber(summary.finalEquity))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pillar 3: Appreciation */}
            <Card className="bg-gradient-to-br from-emerald-50/80 to-emerald-100/50 dark:from-emerald-950/40 dark:to-emerald-900/20 backdrop-blur-md border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 rounded-lg bg-emerald-200/50 dark:bg-emerald-800/30">
                    <TrendingUp className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-emerald-900 dark:text-emerald-200">{t.appreciationGains}</h3>
                    <p className="text-xs text-emerald-700/70 dark:text-emerald-400/70">{t.appreciationGainsDesc}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-emerald-800/70 dark:text-emerald-300/70">{appreciation}% {t.perYear}</span>
                    <span className="font-bold text-emerald-800 dark:text-emerald-200">
                      {formatCurrencySafe(roundNumber(appreciationPerMonth))}{t.perMonth}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-emerald-800/70 dark:text-emerald-300/70">{t.perYear}</span>
                    <span className="font-bold text-emerald-800 dark:text-emerald-200">
                      {formatCurrencySafe(roundNumber(propertyValue * appreciation / 100))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-emerald-300/30 dark:border-emerald-700/30">
                    <span className="text-sm text-emerald-800/70 dark:text-emerald-300/70">{mortgageTerm} {t.yearsLabel}</span>
                    <span className="font-bold text-lg text-emerald-900 dark:text-emerald-100">
                      {formatCurrencySafe(roundNumber(summary.finalAppreciation))}
                    </span>
                  </div>
                  <div className="text-center pt-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-emerald-200/50 dark:bg-emerald-800/30 text-emerald-800 dark:text-emerald-300">
                      {t.total}: {formatCurrencySafe(roundNumber(summary.finalAppreciation))}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ===== TOTAL WEALTH SUMMARY ===== */}
          <Card className="bg-gradient-to-r from-violet-100/80 via-purple-50/80 to-fuchsia-100/80 dark:from-violet-950/50 dark:via-purple-950/50 dark:to-fuchsia-950/50 backdrop-blur-md border border-violet-200/50 dark:border-violet-800/30 shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="text-center md:text-start">
                  <p className="text-sm text-violet-700/70 dark:text-violet-300/70 mb-1">{t.totalWealthBuilt} ({mortgageTerm} {t.yearsLabel})</p>
                  <p className="text-4xl font-bold text-violet-900 dark:text-violet-100">
                    {formatCurrencySafe(roundNumber(summary.totalWealth))}
                  </p>
                </div>
                <div className="flex gap-6 text-center">
                  <div>
                    <p className="text-xs text-violet-600/70 dark:text-violet-400/70">{t.yourInvestment}</p>
                    <p className="text-lg font-semibold text-violet-800 dark:text-violet-200">{formatCurrencySafe(downPayment)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-violet-600/70 dark:text-violet-400/70">{t.totalROI}</p>
                    <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">+{summary.totalROI.toFixed(0)}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-violet-600/70 dark:text-violet-400/70">{t.annualizedROI}</p>
                    <p className="text-lg font-semibold text-emerald-600 dark:text-emerald-400">+{summary.annualizedROI.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ===== LEVERAGE CALLOUT ===== */}
          <Card className="bg-gradient-to-r from-amber-50/60 to-orange-50/60 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/30 dark:border-amber-800/20">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-200/50 dark:bg-amber-800/30 shrink-0">
                  <Zap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                    {t.leveragePower}
                    <Sparkles className="w-4 h-4" />
                  </h4>
                  <p className="text-sm text-amber-800/80 dark:text-amber-300/80 mt-1">
                    {appreciation}% {t.appreciationOn} {formatCurrencySafe(propertyValue)} = <span className="font-semibold">{formatCurrencySafe(roundNumber(summary.annualAppreciationDollars))}{t.perYear}</span>
                    <br />
                    {t.butYouOnlyInvested} {formatCurrencySafe(downPayment)}...
                    <br />
                    <span className="text-amber-900 dark:text-amber-100 font-bold">
                      {t.thatsReturn.replace('{n}', summary.leverageReturn.toFixed(1))}
                    </span>
                    <span className="text-xs ms-2 opacity-70">({t.bankMoneyWorksForYou})</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ===== CUMULATIVE WEALTH CHART ===== */}
          <Card className="overflow-hidden border border-white/20 dark:border-white/10 shadow-lg backdrop-blur-md bg-white/90 dark:bg-zinc-900/80 rounded-2xl">
            <CardContent className="p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
                {t.wealthOverTime}
              </h3>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={wealthChartData} margin={{ top: 10, right: 10, left: windowWidth < 768 ? -20 : 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                    <XAxis 
                      dataKey="year" 
                      tickLine={false} 
                      axisLine={{ stroke: '#eaeaea' }}
                      tick={{ fill: '#888', fontSize: 12 }}
                      label={{ value: t.years, position: 'insideBottom', offset: -5, fill: '#888', fontSize: 12 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => abbreviateNumber(value)}
                      tickLine={false}
                      axisLine={{ stroke: '#eaeaea' }}
                      tick={{ fill: '#888', fontSize: 12 }}
                      width={60}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string) => [formatCurrencySafe(value), name]}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background) / 0.95)',
                        borderRadius: '8px',
                        border: '1px solid hsl(var(--border) / 0.2)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      }}
                    />
                    <Legend 
                      verticalAlign="top" 
                      height={36}
                      formatter={(value) => <span className="text-gray-600 dark:text-gray-400 text-xs ms-1">{value}</span>}
                    />
                    <Area type="monotone" dataKey="appreciation" name={t.accumulatedAppreciation} stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="equity" name={t.accumulatedEquity} stackId="1" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="cashFlow" name={t.accumulatedCashFlow} stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* ===== CROSSOVER CHART: Rent vs Mortgage ===== */}
          <Card className="overflow-hidden border border-white/20 dark:border-white/10 shadow-lg backdrop-blur-md bg-white/90 dark:bg-zinc-900/80 rounded-2xl">
            <CardContent className="p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent">
                {t.cashFlowEvolution}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                {t.fixedPayment} vs {t.growingIncome}
              </p>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={crossoverChartData} margin={{ top: 10, right: 10, left: windowWidth < 768 ? -20 : 10, bottom: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
                    <XAxis 
                      dataKey="year" 
                      tickLine={false}
                      axisLine={{ stroke: '#eaeaea' }}
                      tick={{ fill: '#888', fontSize: 12 }}
                    />
                    <YAxis 
                      tickFormatter={(value) => abbreviateNumber(value)}
                      tickLine={false}
                      axisLine={{ stroke: '#eaeaea' }}
                      tick={{ fill: '#888', fontSize: 12 }}
                      width={60}
                    />
                    <Tooltip 
                      formatter={(value: number, name: string) => [formatCurrencySafe(value), name]}
                      contentStyle={{
                        backgroundColor: 'hsl(var(--background) / 0.95)',
                        borderRadius: '8px',
                        border: '1px solid hsl(var(--border) / 0.2)',
                      }}
                    />
                    <Legend verticalAlign="top" height={36} />
                    <ReferenceLine y={0} stroke="#888" strokeDasharray="3 3" />
                    <Line type="monotone" dataKey="rent" name={t.rentIncome} stroke="#10b981" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="mortgage" name={t.mortgagePayment} stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    <Line type="monotone" dataKey="cashFlow" name={t.cashFlow} stroke="#f59e0b" strokeWidth={3} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* ===== KEY MILESTONES ===== */}
          <Card className="overflow-hidden border border-white/20 dark:border-white/10 shadow-lg backdrop-blur-md bg-white/90 dark:bg-zinc-900/80 rounded-2xl">
            <CardContent className="p-4 md:p-6">
              <h3 className="text-lg font-semibold mb-4 bg-gradient-to-r from-zinc-800 to-zinc-600 dark:from-zinc-200 dark:to-zinc-400 bg-clip-text text-transparent flex items-center gap-2">
                <Target className="w-5 h-5" />
                {t.keyMilestones}
              </h3>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                {milestones.map((milestone) => (
                  <div 
                    key={milestone.year}
                    className="flex flex-col items-center p-3 rounded-xl bg-zinc-50/80 dark:bg-zinc-800/50 border border-zinc-200/50 dark:border-zinc-700/30 min-w-[100px]"
                  >
                    <span className="text-xs text-gray-500 dark:text-gray-400">{t.year} {milestone.year}</span>
                    <span className={`text-lg font-bold ${getMilestoneColor(milestone.status)}`}>
                      {formatCurrencySafe(roundNumber(milestone.cashFlow))}
                    </span>
                    <span className={`text-xs ${getMilestoneColor(milestone.status)}`}>
                      {getMilestoneLabel(milestone.status)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

        </CardContent>
      </Card>

      {/* ===== HELP DRAWER ===== */}
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
