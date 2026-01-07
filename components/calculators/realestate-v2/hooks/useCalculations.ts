/**
 * Real Estate Calculator V2 - Calculations Hook
 *
 * This hook wraps the pure calculation functions with React memoization
 * to prevent unnecessary recalculations during re-renders.
 */

import { useMemo } from 'react';
import type {
	RealEstateInputs,
	DerivedValues,
	ProjectionData,
	ChartDataPoint,
} from '../types';
import {
	calculateDerivedValues,
	generateProjectionData,
	sampleChartData,
} from '../utils/calculations';

interface UseCalculationsResult {
	derived: DerivedValues;
	projection: ProjectionData;
	chartDisplayData: ChartDataPoint[];
}

/**
 * Custom hook that provides memoized calculation results.
 *
 * The calculations are only re-run when the inputs change,
 * preventing unnecessary work during re-renders.
 */
export function useCalculations(
	inputs: RealEstateInputs
): UseCalculationsResult {
	// Memoize derived values (cheap calculation)
	const derived = useMemo(
		() => calculateDerivedValues(inputs),
		[
			inputs.purchasePrice,
			inputs.belowMarketPercent,
			inputs.downPaymentPercent,
			inputs.mortgageRate,
			inputs.mortgageTermYears,
		]
	);

	// Memoize projection (expensive calculation)
	// Only recalculate when inputs that affect projection change
	const projection = useMemo(
		() => generateProjectionData(inputs),
		[
			inputs.purchasePrice,
			inputs.belowMarketPercent,
			inputs.monthlyRent,
			inputs.appreciationRate,
			inputs.rentGrowthRate,
			inputs.downPaymentPercent,
			inputs.mortgageRate,
			inputs.mortgageTermYears,
			inputs.vacancyRate,
			inputs.insuranceTaxMonthly,
			inputs.propertyManagementPercent,
			inputs.maintenancePercent,
		]
	);

	// Memoize chart-ready data with sampling for rendering
	// Show every 3rd month for smoother rendering (~120 points instead of 361)
	// But keep all yearly endpoints for accuracy
	const chartDisplayData = useMemo(
		() => sampleChartData(projection.chartData),
		[projection.chartData]
	);

	return {
		derived,
		projection,
		chartDisplayData,
	};
}
