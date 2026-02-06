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

/** Slider keys that support user-customizable min/max ranges */
const EDITABLE_RANGE_KEYS = new Set<keyof RealEstateInputs>([
	'purchasePrice',
	'monthlyRent',
]);

interface InputPanelProps {
	inputs: RealEstateInputs;
	onInputChange: <K extends keyof RealEstateInputs>(
		key: K,
		value: number
	) => void;
	sliderConfigs: SliderConfigs;
	translations: any;
	advancedOpen: boolean;
	onAdvancedToggle: (open: boolean) => void;
	onHelpClick: (title: string, description: string) => void;
	formatCurrency: (value: number) => string;
	onRangeChange?: (key: keyof RealEstateInputs, field: 'min' | 'max', value: number) => void;
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
	onRangeChange,
}: InputPanelProps) {
	// Track which min/max label is currently being edited
	const [editingRange, setEditingRange] = React.useState<{
		key: keyof RealEstateInputs;
		field: 'min' | 'max';
	} | null>(null);
	const [editingValue, setEditingValue] = React.useState('');

	const commitRangeEdit = (key: keyof RealEstateInputs, field: 'min' | 'max') => {
		const parsed = Number(editingValue.replace(/[^0-9.-]+/g, ''));
		const config = sliderConfigs[key];
		if (!isNaN(parsed) && parsed >= 0 && onRangeChange) {
			// Validate: min must be < current max, max must be > current min
			if (field === 'min' && parsed < config.max) {
				onRangeChange(key, 'min', parsed);
			} else if (field === 'max' && parsed > config.min) {
				onRangeChange(key, 'max', parsed);
			}
		}
		setEditingRange(null);
	};

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
			case 'purchasePrice': {
				additionalInfo = `Buying at ${formatCurrency(
					actualPurchasePrice
				)}`;
				break;
			}
			case 'mortgageRate': {
				// Monthly mortgage payment (Spitzer/PMT formula)
				if (loanAmount > 0) {
					const monthlyPayment = calculateMonthlyMortgage(
						loanAmount,
						value, // current mortgage rate from slider
						inputs.mortgageTermYears
					);
					additionalInfo = `${formatCurrency(
						monthlyPayment
					)}/mo`;
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
			case 'sellingCostsPercent': {
				// Selling costs in dollars (based on current market value)
				const sellingCost = inputs.purchasePrice * (value / 100);
				if (sellingCost > 0) {
					additionalInfo = `${formatCurrency(sellingCost)}`;
				}
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
					{EDITABLE_RANGE_KEYS.has(key) && onRangeChange && (
						<div className="flex justify-between items-center mt-1 px-0.5" style={{ marginRight: '106px' }}>
							{(['min', 'max'] as const).map((field) => {
								const isEditing = editingRange?.key === key && editingRange?.field === field;
								const rawVal = config[field];
								const display = (config.prefix || '') + rawVal.toLocaleString() + (config.suffix || '');
								return isEditing ? (
									<input
										key={field}
										autoFocus
										type="text"
										className="w-[80px] text-[10px] px-1 py-0 h-5 rounded border border-primary/40 bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 outline-none focus:border-primary"
										defaultValue={rawVal.toString()}
										onFocus={(e) => setEditingValue(e.target.value)}
										onChange={(e) => setEditingValue(e.target.value)}
										onBlur={() => commitRangeEdit(key, field)}
										onKeyDown={(e) => {
											if (e.key === 'Enter') commitRangeEdit(key, field);
											if (e.key === 'Escape') setEditingRange(null);
										}}
									/>
								) : (
									<span
										key={field}
										className="text-[10px] text-gray-400 dark:text-gray-500 cursor-pointer hover:text-gray-600 dark:hover:text-gray-300 hover:underline decoration-dotted transition-colors"
										onClick={() => {
											setEditingRange({ key, field });
											setEditingValue(rawVal.toString());
										}}
									>
										{display}
									</span>
								);
							})}
						</div>
					)}
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
		'sellingCostsPercent',
		'capitalGainsTaxPercent',
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
