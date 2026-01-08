'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface SliderWithInputProps {
	value: number;
	onValueChange: (value: number) => void;
	min: number;
	max: number;
	step: number;
	formatValue?: (value: number) => string;
	parseValue?: (value: string) => number;
	className?: string;
	/** @deprecated No longer needed - all valid numbers are now accepted */
	allowNegative?: boolean;
}

export function SliderWithInput({
	value,
	onValueChange,
	min,
	max,
	step,
	formatValue = (v) => v.toString(),
	parseValue = (v) => Number(v.replace(/[^0-9.-]+/g, '')),
	className,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	allowNegative,
}: SliderWithInputProps) {
	const [inputValue, setInputValue] = React.useState(formatValue(value));
	const [isFocused, setIsFocused] = React.useState(false);

	// Clamp value to slider range for slider display only
	const clampedSliderValue = Math.min(Math.max(value, min), max);

	// Update input display when value changes externally (not while user is typing)
	React.useEffect(() => {
		if (!isFocused) {
			setInputValue(formatValue(value));
		}
	}, [value, formatValue, isFocused]);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setInputValue(newValue);

		const parsed = parseValue(newValue);
		if (!isNaN(parsed) && isFinite(parsed)) {
			// Accept any valid number - no clamping
			onValueChange(parsed);
		}
	};

	const handleInputFocus = () => {
		setIsFocused(true);
	};

	const handleInputBlur = () => {
		setIsFocused(false);
		const parsed = parseValue(inputValue);

		if (isNaN(parsed) || !isFinite(parsed)) {
			// Only reset to min if the value is completely invalid (NaN)
			setInputValue(formatValue(min));
			onValueChange(min);
		} else {
			// Format the value but keep it as-is (no clamping)
			setInputValue(formatValue(parsed));
			onValueChange(parsed);
		}
	};

	const handleSliderChange = (newValue: number[]) => {
		const val = newValue[0];
		onValueChange(val);
		setInputValue(formatValue(val));
	};

	return (
		<div className={cn('space-y-2', className)}>
			<div className="flex items-center gap-4">
				<SliderPrimitive.Root
					className="relative flex w-full touch-none select-none items-center"
					value={[clampedSliderValue]}
					onValueChange={handleSliderChange}
					min={min}
					max={max}
					step={step}
					aria-label="Amount"
				>
					<SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-primary/20">
						<SliderPrimitive.Range className="absolute h-full bg-gradient-to-r from-primary/50 to-primary" />
					</SliderPrimitive.Track>
					<SliderPrimitive.Thumb className="block h-4 w-4 rounded-full border border-primary/50 bg-gradient-to-b from-background to-background/90 shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
				</SliderPrimitive.Root>
				<Input
					type="text"
					value={inputValue}
					onChange={handleInputChange}
					onFocus={handleInputFocus}
					onBlur={handleInputBlur}
					className="w-[140px]"
				/>
			</div>
		</div>
	);
}
