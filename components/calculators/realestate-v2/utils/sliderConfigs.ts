/**
 * Real Estate Calculator V2 - Slider Configurations
 * 
 * Defines min, max, step, and formatting for all input sliders.
 */

import type { SliderConfigs } from '../types';
import type { RealEstateV2Translation } from '@/lib/translations/realestateV2';

export function getSliderConfigs(t: RealEstateV2Translation): SliderConfigs {
  return {
    purchasePrice: {
      label: t.purchasePrice,
      helpText: t.purchasePrice_help,
      min: 50000,
      max: 300000,
      step: 5000,
      prefix: '$',
    },
    belowMarketPercent: {
      label: t.belowMarket,
      helpText: t.belowMarket_help,
      min: 0,
      max: 40,
      step: 5,
      suffix: '%',
    },
    monthlyRent: {
      label: t.monthlyRent,
      helpText: t.monthlyRent_help,
      min: 500,
      max: 3000,
      step: 50,
      prefix: '$',
    },
    appreciationRate: {
      label: t.appreciation,
      helpText: t.appreciation_help,
      min: 0,
      max: 10,
      step: 0.5,
      suffix: '%',
    },
    rentGrowthRate: {
      label: t.rentGrowth,
      helpText: t.rentGrowth_help,
      min: 0,
      max: 6,
      step: 0.5,
      suffix: '%',
    },
    downPaymentPercent: {
      label: t.downPayment,
      helpText: t.downPayment_help,
      min: 0,
      max: 100,
      step: 5,
      suffix: '%',
    },
    vacancyRate: {
      label: t.vacancyRate,
      helpText: t.vacancyRate_help,
      min: 0,
      max: 20,
      step: 1,
      suffix: '%',
      advanced: true,
    },
    insuranceTaxMonthly: {
      label: t.insuranceTax,
      helpText: t.insuranceTax_help,
      min: 0,
      max: 500,
      step: 25,
      prefix: '$',
      suffix: '/mo',
      advanced: true,
    },
    propertyManagementPercent: {
      label: t.propertyManagement,
      helpText: t.propertyManagement_help,
      min: 0,
      max: 15,
      step: 1,
      suffix: '%',
      advanced: true,
    },
    maintenancePercent: {
      label: t.maintenance,
      helpText: t.maintenance_help,
      min: 0,
      max: 5,
      step: 0.5,
      suffix: '%',
      advanced: true,
    },
    mortgageRate: {
      label: t.mortgageRate,
      helpText: t.mortgageRate_help,
      min: 4,
      max: 12,
      step: 0.25,
      suffix: '%',
      advanced: true,
    },
    mortgageTermYears: {
      label: t.mortgageTerm,
      helpText: t.mortgageTerm_help,
      min: 10,
      max: 30,
      step: 5,
      suffix: ' ' + t.years,
      advanced: true,
    },
  };
}

