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

		return (
			<div className="bg-gradient-to-br from-white/70 to-zinc-50/70 dark:from-zinc-800/70 dark:to-zinc-900/50 backdrop-blur-md p-4 rounded-xl border border-white/50 dark:border-zinc-700/30 shadow-md">
				<div className="flex items-center">
					<Label className="text-gray-700 dark:text-gray-300">
						{config.label}
					</Label>
					<HelpButton configKey={key} />
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
	];

	return (
		<div className="space-y-4">
			{/* Basic Inputs */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-zinc-50/50 dark:bg-zinc-800/30 rounded-xl border border-zinc-200/50 dark:border-zinc-700/30">
						{advancedInputs.map((key) => (
							<div key={key}>{renderSlider(key)}</div>
						))}
					</div>
				</CollapsibleContent>
			</Collapsible>
		</div>
	);
}
