/**
 * Real Estate Calculator V2 - Input Panel Component
 *
 * Contains all input sliders organized into:
 * - Basic inputs (always visible)
 * - Advanced settings (collapsible)
 */

'use client';

import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { SliderWithInput } from '@/components/ui/slider-w-input';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from '@/components/ui/collapsible';
import type { RealEstateInputs, SliderConfigs } from '../types';
import { calculateMonthlyMortgage } from '../utils/calculations';

interface InputPanelProps {
	inputs: RealEstateInputs;
	onInputChange: <K extends keyof RealEstateInputs>(
		key: K,
		value: number,
	) => void;
	sliderConfigs: SliderConfigs;
	translations: any;
	advancedOpen: boolean;
	onAdvancedToggle: (open: boolean) => void;
	onHelpClick: (title: string, description: string) => void;
	formatCurrency: (value: number) => string;
}

export function InputPanel({
	inputs,
	onInputChange,
	sliderConfigs,
	translations: t,
	advancedOpen,
	onAdvancedToggle,
	onHelpClick,
	formatCurrency,
}: InputPanelProps) {
	const HelpButton = ({
		configKey,
	}: {
		configKey: keyof RealEstateInputs;
	}) => (
		<Button
			variant="ghost"
			size="icon"
			className="h-5 w-5 rounded-full bg-transparent hover:bg-white/30 dark:hover:bg-black/30 transition-all shadow-sm backdrop-blur-sm p-0 ms-2"
			onClick={(e) => {
				e.stopPropagation();
				const config = sliderConfigs[configKey];
				onHelpClick(config.label, config.helpText);
			}}
		>
			<HelpCircle className="h-3.5 w-3.5 text-sky-700/90 dark:text-sky-400/90 transition-colors" />
		</Button>
	);

	const renderSlider = (key: keyof RealEstateInputs) => {
		const config = sliderConfigs[key];
		const value = inputs[key];

		// Calculate additional info for specific sliders
		// Note: actualPurchasePrice = marketValue × (1 - belowMarket%)
		const actualPurchasePrice =
			inputs.purchasePrice * (1 - inputs.belowMarketPercent / 100);
		const downPaymentAmount =
			actualPurchasePrice * (inputs.downPaymentPercent / 100);
		const loanAmount = actualPurchasePrice - downPaymentAmount;

		let additionalInfo: string | undefined;

		switch (key) {
			case 'belowMarketPercent': {
				// Instant equity = discount from market value
				const instantEquity = inputs.purchasePrice * (value / 100);
				if (instantEquity > 0) {
					additionalInfo = `${formatCurrency(instantEquity)}`;
				}
				break;
			}
			case 'mortgageRate': {
				// Monthly mortgage payment (Spitzer/PMT formula)
				if (loanAmount > 0) {
					const monthlyPayment = calculateMonthlyMortgage(
						loanAmount,
						value, // current mortgage rate from slider
						inputs.mortgageTermYears,
					);
					additionalInfo = `${formatCurrency(monthlyPayment)}/mo`;
				}
				break;
			}
			case 'downPaymentPercent': {
				// Down payment in dollars (based on actual purchase price)
				const downPayment = actualPurchasePrice * (value / 100);
				additionalInfo = `${formatCurrency(downPayment)}`;
				break;
			}
			case 'vacancyRate': {
				// Monthly vacancy loss
				const vacancyLoss = inputs.monthlyRent * (value / 100);
				additionalInfo = `${formatCurrency(vacancyLoss)}/mo`;
				break;
			}
			case 'maintenancePercent': {
				// Annual maintenance cost (based on property value)
				const maintenance = inputs.purchasePrice * (value / 100);
				additionalInfo = `${formatCurrency(maintenance)}/yr`;
				break;
			}
			case 'propertyManagementPercent': {
				// Monthly management fee
				const managementFee = inputs.monthlyRent * (value / 100);
				additionalInfo = `${formatCurrency(managementFee)}/mo`;
				break;
			}
			default: {
				additionalInfo = undefined;
			}
		}

		return (
			<div className="bg-gradient-to-br from-white/70 group to-zinc-50/70 dark:from-zinc-800/70 dark:to-zinc-900/50 backdrop-blur-md p-4 rounded-xl border border-white/50 dark:border-zinc-700/30 shadow-md">
				<div className="flex items-start justify-between">
					<div className="flex items-center">
						<Label className="text-gray-700 dark:text-gray-300">
							{config.label}
						</Label>
						<HelpButton configKey={key} />
					</div>
					<div>
						{additionalInfo && (
							<div className="text-xs font-bold text-gray-700 dark:text-gray-200  pl-1 opacity-30 group-hover:opacity-80 transition-opacity">
								{additionalInfo}
							</div>
						)}
					</div>
				</div>
				<div className="pt-2">
					<SliderWithInput
						value={value}
						onValueChange={(v) => onInputChange(key, v)}
						min={config.min}
						max={config.max}
						step={config.step}
						formatValue={(v) => {
							let formatted = v.toString();
							if (config.prefix)
								formatted = config.prefix + formatted;
							if (config.suffix)
								formatted = formatted + config.suffix;
							return formatted;
						}}
						inputClassName="w-[90px]"
					/>
				</div>
			</div>
		);
	};

	// Basic inputs (always visible)
	const basicInputs: Array<keyof RealEstateInputs> = [
		'purchasePrice',
		'downPaymentPercent',
		'monthlyRent',
		'appreciationRate',
		'rentGrowthRate',
		'belowMarketPercent',
	];

	// Advanced inputs (collapsible)
	const advancedInputs: Array<keyof RealEstateInputs> = [
		'mortgageRate',
		'mortgageTermYears',
		'vacancyRate',
		'insuranceTaxMonthly',
		'propertyManagementPercent',
		'maintenancePercent',
		'closingCosts',
		'cashFlowReinvestmentRate',
	];

	return (
		<div className="space-y-4">
			{/* Basic Inputs */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
				{basicInputs.map((key) => (
					<div key={key}>{renderSlider(key)}</div>
				))}
			</div>

			{/* Advanced Settings (Collapsible) */}
			<Collapsible
				open={advancedOpen}
				onOpenChange={onAdvancedToggle}
			>
				<CollapsibleTrigger asChild>
					<Button
						variant="ghost"
						className="w-full flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
					>
						{advancedOpen ? (
							<ChevronUp className="w-4 h-4" />
						) : (
							<ChevronDown className="w-4 h-4" />
						)}
						{t.advancedSettings}
					</Button>
				</CollapsibleTrigger>
				<CollapsibleContent className="pt-4">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4 p-4 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-xl border border-zinc-200/50 dark:border-zinc-700/30">
						{advancedInputs.map((key) => (
							<div key={key}>{renderSlider(key)}</div>
						))}
					</div>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
}
