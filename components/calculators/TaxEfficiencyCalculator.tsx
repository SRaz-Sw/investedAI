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
import { useTranslationStore } from "@/lib/translations";
import { taxTranslations } from "@/lib/translations/tax";

interface CalculatorInputs {
  initialInvestment: number;
  annualContribution: number;
  returnRate: number;
  taxRate: number;
  retirementTaxRate: number;
  investmentPeriod: number;
  dividendYield: number;
  dividendTaxRate: number;
  capitalGainsTaxRate: number;
  inflationRate: number;
}

export function TaxEfficiencyCalculator() {
  const { language, direction, formatCurrency } = useTranslationStore();
  const t = taxTranslations[language];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [inputs, setInputs] = useState<CalculatorInputs>({
    initialInvestment: 10000,
    annualContribution: 6000,
    returnRate: 8,
    taxRate: 25,
    retirementTaxRate: 22,
    investmentPeriod: 30,
    dividendYield: 2,
    dividendTaxRate: 15,
    capitalGainsTaxRate: 15,
    inflationRate: 2,
  });

  const calculateAccountValues = () => {
    const data = [];
    let traditionalValue = inputs.initialInvestment;
    let rothValue = inputs.initialInvestment * (1 - inputs.taxRate / 100);
    let taxableValue = rothValue;
    
    let traditionalTaxesPaid = 0;
    let rothTaxesPaid = inputs.initialInvestment * (inputs.taxRate / 100);
    let taxableTaxesPaid = rothTaxesPaid;

    const nonDividendReturn = inputs.returnRate - inputs.dividendYield;

    for (let year = 0; year <= inputs.investmentPeriod; year++) {
      // Traditional IRA/401k
      const traditionalContribution = inputs.annualContribution;
      traditionalValue = traditionalValue * (1 + inputs.returnRate / 100) + traditionalContribution;

      // Roth IRA
      const rothContribution = inputs.annualContribution * (1 - inputs.taxRate / 100);
      rothValue = rothValue * (1 + inputs.returnRate / 100) + rothContribution;
      rothTaxesPaid += inputs.annualContribution * (inputs.taxRate / 100);

      // Taxable Account
      const taxableContribution = rothContribution;
      const dividendIncome = taxableValue * (inputs.dividendYield / 100);
      const dividendTax = dividendIncome * (inputs.dividendTaxRate / 100);
      const growthBeforeTax = taxableValue * (nonDividendReturn / 100);
      
      taxableValue = taxableValue + growthBeforeTax + dividendIncome - dividendTax + taxableContribution;
      taxableTaxesPaid += dividendTax;

      const realTraditionalValue = traditionalValue * (1 - inputs.retirementTaxRate / 100);
      const realRothValue = rothValue;
      const realTaxableValue = taxableValue * (1 - inputs.capitalGainsTaxRate / 100);

      data.push({
        year,
        traditional: Math.round(realTraditionalValue),
        roth: Math.round(realRothValue),
        taxable: Math.round(realTaxableValue),
        traditionalGross: Math.round(traditionalValue),
        rothGross: Math.round(rothValue),
        taxableGross: Math.round(taxableValue),
      });
    }

    return {
      data,
      taxes: {
        traditional: traditionalValue * (inputs.retirementTaxRate / 100),
        roth: rothTaxesPaid,
        taxable: taxableTaxesPaid + (taxableValue - rothValue) * (inputs.capitalGainsTaxRate / 100),
      },
      totalContributions: inputs.initialInvestment + inputs.annualContribution * inputs.investmentPeriod,
    };
  };

  const { data: accountData, taxes, totalContributions } = calculateAccountValues();
  const finalYear = accountData[accountData.length - 1];

  if (!mounted) {
    return <div suppressHydrationWarning className="space-y-8" dir={direction()} />;
  }

  return (
    <div suppressHydrationWarning className="space-y-8" dir={direction()}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t.initialInvestment}</Label>
            <Input
              type="number"
              value={inputs.initialInvestment}
              onChange={(e) =>
                setInputs({ ...inputs, initialInvestment: Number(e.target.value) })
              }
              min={0}
            />
          </div>

          <div className="space-y-2">
            <Label>{t.annualContribution}</Label>
            <Input
              type="number"
              value={inputs.annualContribution}
              onChange={(e) =>
                setInputs({ ...inputs, annualContribution: Number(e.target.value) })
              }
              min={0}
            />
          </div>

          <div className="space-y-2">
            <Label>{t.returnRate}</Label>
            <Slider
              value={[inputs.returnRate]}
              onValueChange={(value) =>
                setInputs({ ...inputs, returnRate: value[0] })
              }
              min={1}
              max={15}
              step={0.1}
            />
            <div className="text-right text-sm text-muted-foreground">
              {inputs.returnRate.toFixed(1)}%
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
              max={50}
              step={1}
            />
            <div className="text-right text-sm text-muted-foreground">
              {inputs.taxRate}%
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t.retirementTaxRate}</Label>
            <Slider
              value={[inputs.retirementTaxRate]}
              onValueChange={(value) =>
                setInputs({ ...inputs, retirementTaxRate: value[0] })
              }
              min={0}
              max={50}
              step={1}
            />
            <div className="text-right text-sm text-muted-foreground">
              {inputs.retirementTaxRate}%
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>{t.dividendYield}</Label>
            <Slider
              value={[inputs.dividendYield]}
              onValueChange={(value) =>
                setInputs({ ...inputs, dividendYield: value[0] })
              }
              min={0}
              max={5}
              step={0.1}
            />
            <div className="text-right text-sm text-muted-foreground">
              {inputs.dividendYield.toFixed(1)}%
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t.dividendTaxRate}</Label>
            <Slider
              value={[inputs.dividendTaxRate]}
              onValueChange={(value) =>
                setInputs({ ...inputs, dividendTaxRate: value[0] })
              }
              min={0}
              max={50}
              step={1}
            />
            <div className="text-right text-sm text-muted-foreground">
              {inputs.dividendTaxRate}%
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t.capitalGainsTaxRate}</Label>
            <Slider
              value={[inputs.capitalGainsTaxRate]}
              onValueChange={(value) =>
                setInputs({ ...inputs, capitalGainsTaxRate: value[0] })
              }
              min={0}
              max={40}
              step={1}
            />
            <div className="text-right text-sm text-muted-foreground">
              {inputs.capitalGainsTaxRate}%
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t.investmentPeriod}</Label>
            <Slider
              value={[inputs.investmentPeriod]}
              onValueChange={(value) =>
                setInputs({ ...inputs, investmentPeriod: value[0] })
              }
              min={5}
              max={40}
              step={1}
            />
            <div className="text-right text-sm text-muted-foreground">
              {inputs.investmentPeriod} {t.years}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold mb-4">{t.accountValue}</h3>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={accountData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="year" 
                    label={{ value: t.years, position: 'bottom', className: 'fill-foreground' }}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => formatCurrency(value).split('.')[0]}
                    label={{ 
                      value: t.accountValue, 
                      angle: -90, 
                      position: 'insideLeft',
                      className: 'fill-foreground'
                    }}
                    tick={{ fill: 'hsl(var(--foreground))' }}
                  />
                  <Tooltip
                    formatter={(value: number | undefined) => value !== undefined ? [formatCurrency(value), ''] : ['', '']}
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      border: '1px solid hsl(var(--border))',
                      color: 'hsl(var(--foreground))'
                    }}
                  />
                  <Legend 
                    formatter={(value) => (
                      <span className="text-foreground">
                        {value === "traditional" ? t.traditionalIRA :
                         value === "roth" ? t.rothIRA :
                         t.taxableAccount}
                      </span>
                    )}
                  />
                  <Line
                    type="monotone"
                    dataKey="traditional"
                    name="traditional"
                    stroke="hsl(var(--chart-1))"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="roth"
                    name="roth"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="taxable"
                    name="taxable"
                    stroke="hsl(var(--chart-3))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">{t.traditionalIRA}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line mb-4">
                {t.traditionalDescription}
              </p>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t.finalValue}</dt>
                  <dd className="font-medium" suppressHydrationWarning>
                    {formatCurrency(finalYear.traditional)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t.totalTaxesPaid}</dt>
                  <dd className="font-medium" suppressHydrationWarning>
                    {formatCurrency(taxes.traditional)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t.effectiveTaxRate}</dt>
                  <dd className="font-medium">
                    {((taxes.traditional / finalYear.traditionalGross) * 100).toFixed(1)}%
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">{t.rothIRA}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line mb-4">
                {t.rothDescription}
              </p>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t.finalValue}</dt>
                  <dd className="font-medium" suppressHydrationWarning>
                    {formatCurrency(finalYear.roth)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t.totalTaxesPaid}</dt>
                  <dd className="font-medium" suppressHydrationWarning>
                    {formatCurrency(taxes.roth)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t.effectiveTaxRate}</dt>
                  <dd className="font-medium">
                    {((taxes.roth / finalYear.rothGross) * 100).toFixed(1)}%
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">{t.taxableAccount}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line mb-4">
                {t.taxableDescription}
              </p>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t.finalValue}</dt>
                  <dd className="font-medium" suppressHydrationWarning>
                    {formatCurrency(finalYear.taxable)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t.totalTaxesPaid}</dt>
                  <dd className="font-medium" suppressHydrationWarning>
                    {formatCurrency(taxes.taxable)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t.effectiveTaxRate}</dt>
                  <dd className="font-medium">
                    {((taxes.taxable / finalYear.taxableGross) * 100).toFixed(1)}%
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