'use client';

import React, { useState, useEffect } from 'react';
import { useTranslationStore } from "@/lib/translations";
import { doublingTranslations } from "@/lib/translations/doubling";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export function DoublingCalculator() {
  const { language, direction } = useTranslationStore();
  const t = doublingTranslations[language];

  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(72 / 7);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const doublingTime = rate > 0 ? 72 / rate : Infinity;
    setYears(doublingTime);
    const timer = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timer);
  }, [rate]);

  const progressPercentage = Math.min((rate / 20) * 100, 100);
  const yearsDisplay = years === Infinity ? '∞' : years.toFixed(1);
  const preciseYears = (Math.log(2) / Math.log(1 + rate / 100)).toFixed(2);

  const presets = [
    { label: t.presetSavingsAccount, rate: 2, color: '#94a3b8' },
    { label: t.presetBonds, rate: 5, color: '#60a5fa' },
    { label: t.presetSP500, rate: 10, color: '#34d399' },
    { label: t.presetAggressiveGrowth, rate: 15, color: '#f472b6' },
  ];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center p-4" dir={direction()}>
      <div className="w-full max-w-2xl">
        <Card className="backdrop-blur-xl bg-card/80 border-border/50 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-3xl md:text-4xl font-bold">
              {t.title}
            </CardTitle>
            <CardDescription className="text-sm md:text-base">
              {t.subtitle}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Slider Section */}
            <div className="relative">
              <div className="flex justify-between items-end mb-4">
                <span className="text-muted-foreground text-sm">{t.annualReturnRate}</span>
                <div className="flex items-baseline gap-1">
                  <span
                    className={`text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent transition-all duration-300 ${isAnimating ? 'scale-110' : 'scale-100'}`}
                  >
                    {rate}
                  </span>
                  <span className="text-2xl text-muted-foreground">%</span>
                </div>
              </div>

              <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary/80 to-primary/60 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-background border-2 border-primary rounded-full shadow-lg transition-all duration-300 ease-out"
                  style={{ [direction() === 'rtl' ? 'right' : 'left']: `calc(${progressPercentage}% - 12px)` }}
                />
              </div>

              <input
                type="range"
                min="1"
                max="20"
                step="0.5"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                style={{ direction: 'ltr' }}
              />

              <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                <span>1%</span>
                <span>20%</span>
              </div>
            </div>

            {/* Result Display */}
            <div className="bg-primary/10 rounded-2xl p-6 md:p-8 border border-primary/20">
              <p className="text-muted-foreground text-center mb-2">{t.moneyWillDouble}</p>
              <div className="flex items-baseline justify-center gap-2">
                <span
                  className={`text-6xl md:text-7xl font-bold text-foreground transition-all duration-300 ${isAnimating ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}
                >
                  {yearsDisplay}
                </span>
                <span className="text-2xl text-muted-foreground">{t.years}</span>
              </div>

              <div className="mt-6 flex justify-center">
                <div className="flex items-center gap-2">
                  {[...Array(Math.min(Math.ceil(years), 10))].map((_, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-primary/60 animate-pulse"
                      style={{
                        animationDelay: `${i * 100}ms`,
                        opacity: 1 - (i * 0.08)
                      }}
                    />
                  ))}
                  {years > 10 && <span className="text-muted-foreground text-sm ml-1">...</span>}
                </div>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setRate(preset.rate)}
                  className={`p-3 rounded-xl text-center transition-all duration-200 hover:scale-105 active:scale-95 ${
                    rate === preset.rate
                      ? 'bg-primary/20 border-2 border-primary/40'
                      : 'bg-muted/50 border border-border hover:bg-muted'
                  }`}
                >
                  <div
                    className="w-3 h-3 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: preset.color }}
                  />
                  <p className="text-foreground text-xs font-medium">{preset.label}</p>
                  <p className="text-muted-foreground text-xs">{preset.rate}%</p>
                </button>
              ))}
            </div>

            {/* Footer Note */}
            <div className="pt-6 border-t border-border">
              <p className="text-muted-foreground/60 text-xs text-center">
                {t.ruleOf72Note}
                <br />
                {t.preciseTime} {preciseYears} {t.years}.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
