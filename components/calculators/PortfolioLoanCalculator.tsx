"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { useTranslationStore } from "@/lib/translations";
import { portfolioTranslations } from "@/lib/translations/portfolio";
import { useCurrencyFormatter } from '@/lib/hooks/useCurrencyFormatter';

interface CalculatorInputs {
  initialPortfolio: number;
  loanAmount: number;
  interestRate: number;
  marketReturn: number;
  taxRate: number;
}

export function PortfolioLoanCalculator() {
  const { language, direction } = useTranslationStore();
  const { formatCurrencySafe, abbreviateNumber } = useCurrencyFormatter();
  const t = portfolioTranslations[language];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [inputs, setInputs] = useState<CalculatorInputs>({
    initialPortfolio: 500000,
    loanAmount: 100000,
    interestRate: 5,
    marketReturn: 10,
    taxRate: 20,
  });

  // Calculate portfolio values over time
  const calculatePortfolioValues = () => {
    const years = 9;
    const data = [];
    
    let loanPortfolioValue = inputs.initialPortfolio;
    let sellPortfolioValue = inputs.initialPortfolio - (inputs.loanAmount / (1 - inputs.taxRate / 100));
    
    for (let year = 0; year <= years; year++) {
      const loanInterest = inputs.loanAmount * (inputs.interestRate / 100);
      loanPortfolioValue = loanPortfolioValue * (1 + inputs.marketReturn / 100) - loanInterest;
      sellPortfolioValue = sellPortfolioValue * (1 + inputs.marketReturn / 100);
      
      data.push({
        year,
        loanStrategy: Math.round(loanPortfolioValue),
        sellStrategy: Math.round(sellPortfolioValue),
        loanInterestPaid: Math.round(loanInterest),
      });
    }
    
    return data;
  };

  const portfolioData = calculatePortfolioValues();
  const finalYear = portfolioData[portfolioData.length - 1];
  const totalInterestPaid = portfolioData.reduce((sum, year) => sum + year.loanInterestPaid, 0);
  const taxPaid = inputs.loanAmount * (inputs.taxRate / 100);
  const taxOpportunityCost = taxPaid * Math.pow(1 + inputs.marketReturn / 100, 9);

  // If not mounted yet, show a simple loading state
  if (!mounted) {
    return <div suppressHydrationWarning className="space-y-8" dir={direction()} />;
  }

  return (
    <div suppressHydrationWarning className="space-y-8" dir={direction()}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t.initialPortfolio}</Label>
            <Input
              type="number"
              value={inputs.initialPortfolio}
              onChange={(e) =>
                setInputs({ ...inputs, initialPortfolio: Number(e.target.value) })
              }
              min={0}
            />
          </div>

          <div className="space-y-2">
            <Label>{t.loanAmount}</Label>
            <Input
              type="number"
              value={inputs.loanAmount}
              onChange={(e) =>
                setInputs({ ...inputs, loanAmount: Number(e.target.value) })
              }
              min={0}
            />
          </div>

          <div className="space-y-2">
            <Label>{t.interestRate}</Label>
            <Slider
              value={[inputs.interestRate]}
              onValueChange={(value) =>
                setInputs({ ...inputs, interestRate: value[0] })
              }
              min={1}
              max={15}
              step={0.1}
            />
            <div className="text-right text-sm text-muted-foreground">
              {inputs.interestRate.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t.marketReturn}</Label>
            <Slider
              value={[inputs.marketReturn]}
              onValueChange={(value) =>
                setInputs({ ...inputs, marketReturn: value[0] })
              }
              min={1}
              max={20}
              step={0.1}
            />
            <div className="text-right text-sm text-muted-foreground">
              {inputs.marketReturn.toFixed(1)}%
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t.taxRate}</Label>
            <Slider
              value={[inputs.taxRate]}
              onValueChange={(value) =>
                setInputs({ ...inputs, taxRate: value[0] })
              }
              min={0}
              max={40}
              step={1}
            />
            <div className="text-right text-sm text-muted-foreground">
              {inputs.taxRate}%
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">{t.portfolioValue}</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={portfolioData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="year" 
                    label={{ value: t.years, position: 'bottom', className: 'fill-foreground' }}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCurrencySafe(value).split('.')[0]}
                    label={{ 
                      value: t.portfolioValue, 
                      angle: -90, 
                      position: 'insideLeft',
                      className: 'fill-foreground'
                    }}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <Tooltip
                    formatter={(value: number | undefined) => value !== undefined ? [formatCurrencySafe(value), ''] : ['', '']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Legend 
                    formatter={(value) => (
                      <span className="text-foreground">
                        {value === "loanStrategy" ? t.loanStrategy : t.sellStrategy}
                      </span>
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="loanStrategy"
                    name="loanStrategy"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="sellStrategy"
                    name="sellStrategy"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">{t.loanStrategySummary}</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t.finalPortfolioValue}</dt>
                  <dd className="font-medium" suppressHydrationWarning>
                    {formatCurrencySafe(finalYear.loanStrategy)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t.netWorthAfterLoan}</dt>
                  <dd className="font-medium" suppressHydrationWarning>
                    {formatCurrencySafe(finalYear.loanStrategy - inputs.loanAmount)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t.totalInterestPaid}</dt>
                  <dd className="font-medium" suppressHydrationWarning>
                    {formatCurrencySafe(totalInterestPaid)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">{t.sellStrategySummary}</h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t.finalPortfolioValue}</dt>
                  <dd className="font-medium" suppressHydrationWarning>
                    {formatCurrencySafe(finalYear.sellStrategy)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t.initialTaxPaid}</dt>
                  <dd className="font-medium" suppressHydrationWarning>
                    {formatCurrencySafe(taxPaid)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t.taxOpportunityCost}</dt>
                  <dd className="font-medium" suppressHydrationWarning>
                    {formatCurrencySafe(Math.round(taxOpportunityCost))}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}