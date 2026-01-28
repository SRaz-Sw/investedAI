'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTranslationStore } from '@/lib/translations';
import { portfolioTranslations } from '@/lib/translations/portfolio';

const PortfolioLoanCalculator = () => {
  const { language, direction, formatCurrency } = useTranslationStore();
  const t = portfolioTranslations[language];
  const [mounted, setMounted] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [loanStrategy, setLoanStrategy] = useState('upfront');
  const [inputs, setInputs] = useState({
    initialInvestment: 100000,
    currentValue: 200000,
    targetCash: 100000,
    taxRate: 25,
    interestRate: 5,
    marketReturn: 10,
    years: 5,
    profitPercentage: 50,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const calculateRequiredLoan = (
    principal: number,
    rate: number,
    years: number
  ) => {
    const annualRate = rate / 100;
    if (annualRate * years >= 1) return principal * 2;
    return principal / (1 - annualRate * years);
  };

  const calculateUpfrontLoan = (
    targetCash: number,
    rate: number,
    years: number
  ) => {
    const annualRate = rate / 100;
    if (annualRate * years >= 1) return targetCash * 2;
    return targetCash / (1 - annualRate * years);
  };

  const calculateMonthlyInterest = (loanAmount: number, rate: number) => {
    return (loanAmount * (rate / 100)) / 12;
  };

  const calculateValues = () => {
    const data = [];
    const taxPerDollarSold =
      (inputs.profitPercentage / 100) * (inputs.taxRate / 100);

    const amountToSell = inputs.targetCash / (1 - taxPerDollarSold);
    const taxPaid = amountToSell * taxPerDollarSold;
    let sellPortfolioValue = inputs.currentValue - amountToSell;

    let totalLoanNeeded = inputs.targetCash;
    let yearlyInterest = totalLoanNeeded * (inputs.interestRate / 100);
    let monthlyInterest = calculateMonthlyInterest(
      totalLoanNeeded,
      inputs.interestRate
    );
    let accumulatedInterest = 0;
    let loanPortfolioValue = inputs.currentValue;

    if (loanStrategy === 'upfront') {
      totalLoanNeeded = calculateUpfrontLoan(
        inputs.targetCash,
        inputs.interestRate,
        inputs.years
      );
      accumulatedInterest = totalLoanNeeded - inputs.targetCash;
    }

    for (let year = 0; year <= inputs.years; year++) {
      if (year > 0) {
        sellPortfolioValue =
          sellPortfolioValue * (1 + inputs.marketReturn / 100);
        if (loanStrategy === 'upfront') {
          loanPortfolioValue =
            loanPortfolioValue * (1 + inputs.marketReturn / 100);
        } else {
          let monthlyPortfolioValue = loanPortfolioValue;
          const monthlyReturn = inputs.marketReturn / 1200;

          for (let month = 0; month < 12; month++) {
            monthlyPortfolioValue =
              monthlyPortfolioValue * (1 + monthlyReturn) - monthlyInterest;
            accumulatedInterest += monthlyInterest;
          }
          loanPortfolioValue = monthlyPortfolioValue;
        }
      }

      data.push({
        year,
        loanStrategy: Math.round(loanPortfolioValue),
        loanStrategyNet: Math.round(loanPortfolioValue - totalLoanNeeded),
        sellStrategy: Math.round(sellPortfolioValue),
        loanBalance: totalLoanNeeded,
        yearlyInterest: Math.round(yearlyInterest),
        totalInterestPaid: Math.round(accumulatedInterest),
        monthlyPayment:
          loanStrategy === 'monthly' ? Math.round(monthlyInterest) : 0,
      });
    }

    return {
      data,
      summary: {
        amountToSell,
        taxPaid,
        yearlyInterest,
        totalLoanNeeded,
        totalInterest: totalLoanNeeded - inputs.targetCash,
      },
    };
  };

  const { data, summary } = calculateValues();
  const finalYear = data[data.length - 1];

  if (!mounted) {
    return <div className="space-y-8" dir={direction()} />;
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardContent className="space-y-6 p-6" dir={direction()}>
        {/* Loan Strategy Toggle */}
        <div className="p-4 bg-muted rounded-lg">
          <h3 className="font-semibold mb-4">{t.chooseLoanStrategy}</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Button
              variant={loanStrategy === 'upfront' ? 'default' : 'outline'}
              onClick={() => setLoanStrategy('upfront')}
              className={`p-4 h-auto flex flex-col items-center text-center ${
                loanStrategy === 'upfront' ? 'ring-2 ring-primary' : ''
              }`}
            >
              <span className="font-semibold mb-2">{t.upfrontInterest}</span>
              <span className="text-sm text-muted-foreground max-w-[200px]">
                {t.upfrontInterestDesc}
              </span>
            </Button>
            <Button
              variant={loanStrategy === 'monthly' ? 'default' : 'outline'}
              onClick={() => setLoanStrategy('monthly')}
              className={`p-4 h-auto flex flex-col items-center text-center ${
                loanStrategy === 'monthly' ? 'ring-2 ring-primary' : ''
              }`}
            >
              <span className="font-semibold mb-2">{t.monthlyPayments}</span>
              <span className="text-sm text-muted-foreground max-w-[200px]">
                {t.monthlyPaymentsDesc}
              </span>
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label>{t.marketReturn}</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">
                        Annual interest rate charged on the portfolio loan
                        (typically lower than regular loans due to the portfolio
                        collateral)
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Slider
                value={[inputs.interestRate]}
                onValueChange={(value) =>
                  setInputs({ ...inputs, interestRate: value[0] })
                }
                min={1}
                max={10}
                step={0.25}
              />
              <div className="text-right text-sm text-muted-foreground">
                {inputs.interestRate}%
              </div>
            </div>
          </div>

          <div className="p-4 bg-secondary/10 rounded-lg">
            <h3 className="font-semibold mb-2">{t.subtitle}</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-muted-foreground">{t.currentValue}:</div>
              <div className="text-right">
                {formatCurrency(inputs.currentValue)}
              </div>
              <div className="text-muted-foreground">{t.targetCash}:</div>
              <div className="text-right">
                {formatCurrency(inputs.targetCash)}
              </div>
            </div>
          </div>
        </div>

        {/* Chart Section */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="year"
                tick={{ fill: 'hsl(var(--foreground))' }}
                label={{
                  value: t.years,
                  position: 'bottom',
                  className: 'fill-foreground',
                }}
              />
              <YAxis
                tickFormatter={(value) => formatCurrency(value).split('.')[0]}
                tick={{ fill: 'hsl(var(--foreground))' }}
                label={{
                  value: t.portfolioValue,
                  angle: -90,
                  position: 'insideLeft',
                  className: 'fill-foreground',
                }}
              />
              <RechartsTooltip
                formatter={(value) => value !== undefined ? [formatCurrency(+value), ''] : ['', '']}
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--border))',
                  color: 'hsl(var(--foreground))',
                }}
              />
              <Legend
                formatter={(value) => (
                  <span className="text-foreground">
                    {value === 'loanStrategy' ? t.loanStrategy : t.sellStrategy}
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

        {/* Results Section */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-primary/5">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">
                {t.loanStrategySummary}
              </h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t.loanAmount}</dt>
                  <dd className="font-medium">
                    {formatCurrency(summary.totalLoanNeeded)}
                  </dd>
                </div>
                {loanStrategy === 'monthly' && (
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">
                      {t.monthlyPayment}
                    </dt>
                    <dd className="font-medium">
                      {formatCurrency(finalYear.monthlyPayment)}
                    </dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    {loanStrategy === 'upfront'
                      ? t.prepaidInterest
                      : t.totalInterestPaid}
                  </dt>
                  <dd className="font-medium">
                    {formatCurrency(finalYear.totalInterestPaid)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    {t.finalPortfolioValue}
                  </dt>
                  <dd className="font-medium">
                    {formatCurrency(finalYear.loanStrategy)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    {t.netWorthAfterLoan}
                  </dt>
                  <dd className="font-medium">
                    {formatCurrency(
                      finalYear.loanStrategy - summary.totalLoanNeeded
                    )}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card className="bg-destructive/5">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-4">
                {t.sellStrategySummary}
              </h3>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t.amountToSell}</dt>
                  <dd className="font-medium">
                    {formatCurrency(summary.amountToSell)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">{t.initialTaxPaid}</dt>
                  <dd className="font-medium">
                    {formatCurrency(summary.taxPaid)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">
                    {t.finalPortfolioValue}
                  </dt>
                  <dd className="font-medium">
                    {formatCurrency(finalYear.sellStrategy)}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>

        {/* Details Toggle */}
        <Button
          variant="ghost"
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-center gap-2"
        >
          {showDetails ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
          {showDetails ? t.hideDetails : t.showDetails}
        </Button>

        {/* Details Section */}
        {showDetails && (
          <div className="mt-4 p-4 bg-muted rounded-lg space-y-4">
            <div>
              <h4 className="font-semibold mb-2">
                {t.constants} & {t.assumptions}
              </h4>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>{t.investmentPeriod}</Label>
                  <Slider
                    value={[inputs.years]}
                    onValueChange={(value) =>
                      setInputs({ ...inputs, years: value[0] })
                    }
                    min={1}
                    max={10}
                    step={1}
                  />
                  <div className="text-right text-sm text-muted-foreground">
                    {inputs.years}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
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
                    <Label>{t.profitPercentage}</Label>
                    <Slider
                      value={[inputs.profitPercentage]}
                      onValueChange={(value) =>
                        setInputs({ ...inputs, profitPercentage: value[0] })
                      }
                      min={0}
                      max={100}
                      step={1}
                    />
                    <div className="text-right text-sm text-muted-foreground">
                      {inputs.profitPercentage}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PortfolioLoanCalculator;

// import React, { useState } from 'react';
// import { Card, CardContent } from '@/components/ui/card';
// import { Label } from '@/components/ui/label';
// import { Slider } from '@/components/ui/slider';
// import { Button } from '@/components/ui/button';
// import { ChevronDown, ChevronUp } from 'lucide-react';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   Legend,
//   ResponsiveContainer,
// } from 'recharts';

// export const PortfolioTaxCalculator = () => {
//   const [showDetails, setShowDetails] = useState(false);
//   const [inputs, setInputs] = useState({
//     initialInvestment: 100000,
//     currentValue: 200000,
//     targetCash: 100000,
//     taxRate: 25,
//     interestRate: 5,
//     marketReturn: 10,
//     years: 3,
//     profitPercentage: 50,
//   });

//   // Formulas as strings for display
//   const formulas = {
//     requiredLoan: 'Required Loan = Target Cash / (1 - (interest_rate * years))',
//     amountToSell:
//       'Amount to Sell = Target Cash / (1 - (profit_percentage * tax_rate))',
//     portfolioGrowth:
//       'Portfolio(year) = Portfolio(year-1) * (1 + market_return) - yearly_interest',
//   };

//   const calculateRequiredLoan = (principal, rate, years) => {
//     const annualRate = rate / 100;
//     if (annualRate * years >= 1) return principal * 2;
//     return principal / (1 - annualRate * years);
//   };

//   const calculateValues = () => {
//     const data = [];
//     const taxPerDollarSold =
//       (inputs.profitPercentage / 100) * (inputs.taxRate / 100);

//     const amountToSell = inputs.targetCash / (1 - taxPerDollarSold);
//     const taxPaid = amountToSell * taxPerDollarSold;
//     let sellPortfolioValue = inputs.currentValue - amountToSell;

//     const totalLoanNeeded = calculateRequiredLoan(
//       inputs.targetCash,
//       inputs.interestRate,
//       inputs.years
//     );
//     const yearlyInterest = totalLoanNeeded * (inputs.interestRate / 100);
//     let loanPortfolioValue = inputs.currentValue;

//     for (let year = 0; year <= inputs.years; year++) {
//       if (year > 0) {
//         sellPortfolioValue =
//           sellPortfolioValue * (1 + inputs.marketReturn / 100);
//         loanPortfolioValue =
//           loanPortfolioValue * (1 + inputs.marketReturn / 100) - yearlyInterest;
//       }

//       data.push({
//         year,
//         loanStrategy: Math.round(loanPortfolioValue),
//         sellStrategy: Math.round(sellPortfolioValue),
//         loanBalance: totalLoanNeeded,
//         yearlyInterest: Math.round(yearlyInterest),
//         totalInterestPaid: Math.round(totalLoanNeeded - inputs.targetCash),
//       });
//     }

//     return {
//       data,
//       summary: {
//         amountToSell,
//         taxPaid,
//         yearlyInterest,
//         totalLoanNeeded,
//         totalInterest: totalLoanNeeded - inputs.targetCash,
//       },
//     };
//   };

//   const { data, summary } = calculateValues();
//   const finalYear = data[data.length - 1];

//   return (
//     <Card className="w-full max-w-4xl">
//       <CardContent className="space-y-6 p-6">
//         <div className="grid gap-6 md:grid-cols-2">
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Market Return Rate (%)</Label>
//               <Slider
//                 value={[inputs.marketReturn]}
//                 onValueChange={(value) =>
//                   setInputs({ ...inputs, marketReturn: value[0] })
//                 }
//                 min={1}
//                 max={20}
//                 step={0.5}
//               />
//               <div className="text-right text-sm text-muted-foreground">
//                 {inputs.marketReturn}%
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label>Loan Interest Rate (%)</Label>
//               <Slider
//                 value={[inputs.interestRate]}
//                 onValueChange={(value) =>
//                   setInputs({ ...inputs, interestRate: value[0] })
//                 }
//                 min={1}
//                 max={10}
//                 step={0.25}
//               />
//               <div className="text-right text-sm text-muted-foreground">
//                 {inputs.interestRate}%
//               </div>
//             </div>

//             <div className="space-y-2">
//               <Label>Years</Label>
//               <Slider
//                 value={[inputs.years]}
//                 onValueChange={(value) =>
//                   setInputs({ ...inputs, years: value[0] })
//                 }
//                 min={1}
//                 max={10}
//                 step={1}
//               />
//               <div className="text-right text-sm text-muted-foreground">
//                 {inputs.years}
//               </div>
//             </div>
//           </div>

//           <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
//             <h3 className="font-semibold mb-2">Initial Portfolio</h3>
//             <div className="grid grid-cols-2 gap-2 text-sm">
//               <div>Cost Basis:</div>
//               <div className="text-right">
//                 \${inputs.initialInvestment.toLocaleString()}
//               </div>
//               <div>Current Value:</div>
//               <div className="text-right">
//                 \${inputs.currentValue.toLocaleString()}
//               </div>
//               <div>Target Cash:</div>
//               <div className="text-right">
//                 \${inputs.targetCash.toLocaleString()}
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="h-80">
//           <ResponsiveContainer width="100%" height="100%">
//             <LineChart data={data}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="year" />
//               <YAxis tickFormatter={(value) => `${value / 1000}k`} />
//               <Tooltip
//                 formatter={(value, name) => [
//                   `${value.toLocaleString()}`,
//                   name === 'loanStrategy' ? 'Loan Strategy' : 'Sell Strategy',
//                 ]}
//               />
//               <Legend />
//               <Line
//                 type="monotone"
//                 dataKey="loanStrategy"
//                 name="Loan Strategy"
//                 stroke="#2563eb"
//                 strokeWidth={2}
//               />
//               <Line
//                 type="monotone"
//                 dataKey="sellStrategy"
//                 name="Sell Strategy"
//                 stroke="#dc2626"
//                 strokeWidth={2}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="grid gap-4 md:grid-cols-2">
//           <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
//             <h3 className="font-semibold mb-2">Loan Strategy</h3>
//             <div className="space-y-2">
//               <div className="flex justify-between">
//                 <span>Required Loan:</span>
//                 <span>
//                   \${Math.round(summary.totalLoanNeeded).toLocaleString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Total Interest:</span>
//                 <span>
//                   \${Math.round(summary.totalInterest).toLocaleString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Final Portfolio Value:</span>
//                 <span>\${finalYear.loanStrategy.toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Net Worth (after loan):</span>
//                 <span>
//                   \$
//                   {(
//                     finalYear.loanStrategy - summary.totalLoanNeeded
//                   ).toLocaleString()}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
//             <h3 className="font-semibold mb-2">Sell Strategy</h3>
//             <div className="space-y-2">
//               <div className="flex justify-between">
//                 <span>Amount to Sell:</span>
//                 <span>
//                   \${Math.round(summary.amountToSell).toLocaleString()}
//                 </span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Tax Paid:</span>
//                 <span>\${Math.round(summary.taxPaid).toLocaleString()}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Final Portfolio Value:</span>
//                 <span>\${finalYear.sellStrategy.toLocaleString()}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div>
//           <Button
//             variant="ghost"
//             onClick={() => setShowDetails(!showDetails)}
//             className="w-full flex items-center justify-center gap-2"
//           >
//             {showDetails ? (
//               <ChevronUp className="h-4 w-4" />
//             ) : (
//               <ChevronDown className="h-4 w-4" />
//             )}
//             {showDetails ? 'Hide Details' : 'Show Details'}
//           </Button>

//           {showDetails && (
//             <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg space-y-4">
//               <div>
//                 <h4 className="font-semibold mb-2">Constants & Assumptions</h4>
//                 <div className="space-y-2">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label>Tax Rate (%)</Label>
//                       <Slider
//                         value={[inputs.taxRate]}
//                         onValueChange={(value) =>
//                           setInputs({ ...inputs, taxRate: value[0] })
//                         }
//                         min={0}
//                         max={50}
//                         step={1}
//                       />
//                       <div className="text-right text-sm text-muted-foreground">
//                         {inputs.taxRate}%
//                       </div>
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Profit Percentage (%)</Label>
//                       <Slider
//                         value={[inputs.profitPercentage]}
//                         onValueChange={(value) =>
//                           setInputs({ ...inputs, profitPercentage: value[0] })
//                         }
//                         min={0}
//                         max={100}
//                         step={1}
//                       />
//                       <div className="text-right text-sm text-muted-foreground">
//                         {inputs.profitPercentage}%
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div>
//                 <h4 className="font-semibold mb-2">Formulas</h4>
//                 <div className="space-y-2 font-mono text-sm">
//                   {Object.entries(formulas).map(([key, formula]) => (
//                     <div
//                       key={key}
//                       className="p-2 bg-gray-100 dark:bg-gray-800 rounded"
//                     >
//                       {formula}
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default PortfolioTaxCalculator;
