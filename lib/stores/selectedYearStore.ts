import { create } from 'zustand';

/**
 * Transient UI state for the selected year in the "3 Engines of Profit" panel.
 * When selectedYear is null, the panel shows Year 1 (default behavior).
 * When a user clicks on the ProjectionChart, selectedYear is set to that year.
 */
interface SelectedYearStore {
  selectedYear: number | null;
  setSelectedYear: (year: number | null) => void;
}

export const useSelectedYearStore = create<SelectedYearStore>()((set) => ({
  selectedYear: null,
  setSelectedYear: (year) => set({ selectedYear: year }),
}));
