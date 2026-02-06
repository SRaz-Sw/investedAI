import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RealEstateInputs } from '@/components/calculators/realestate-pro/types';
import {
  dateToISOString,
  getValidDate,
  createCurrentDate,
  getDateForFilename,
} from '@/lib/utils/dateUtils';

/**
 * SavedProperty - Represents a saved real estate property calculation
 */
export interface SavedProperty {
  id: string;
  name: string;
  inputs: RealEstateInputs;
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
}

/** User-customized slider range overrides */
export type SliderRangeOverrides = Record<string, { min?: number; max?: number }>;

/**
 * ExportData - Structure for exported JSON file
 */
export interface ExportData {
  properties: Array<{
    id: string;
    name: string;
    inputs: RealEstateInputs;
    createdAt: string; // ISO string for JSON serialization
    updatedAt: string; // ISO string for JSON serialization
  }>;
  sliderRanges?: SliderRangeOverrides; // User-customized slider ranges
  exportDate: string; // ISO string
  version: string; // For future migrations
}

/**
 * ImportResult - Result of an import operation
 */
export interface ImportResult {
  success: boolean;
  imported: number;
  skipped: number;
  message: string;
}

/**
 * SavedPropertiesStore - Manages persistence of real estate property calculations
 * Uses Zustand with localStorage persistence for client-side storage
 */
interface SavedPropertiesStore {
  properties: SavedProperty[];
  sliderRanges: SliderRangeOverrides;

  // CRUD operations
  saveProperty: (name: string, inputs: RealEstateInputs) => string;
  updateProperty: (id: string, name: string, inputs: RealEstateInputs) => void;
  deleteProperty: (id: string) => void;
  getProperty: (id: string) => SavedProperty | undefined;

  // Utility functions
  duplicateProperty: (id: string) => string | undefined;
  renameProperty: (id: string, newName: string) => void;
  clearAll: () => void;

  // Slider range overrides
  setSliderRange: (key: string, field: 'min' | 'max', value: number) => void;
  clearSliderRange: (key: string) => void;
  clearAllSliderRanges: () => void;

  // Export/Import functions
  exportToJSON: () => void;
  importFromJSON: (file: File) => Promise<ImportResult>;
}

/**
 * Generate a unique ID for saved properties
 * Format: prop_timestamp_random
 */
const generateId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `prop_${timestamp}_${random}`;
};

/**
 * useSavedPropertiesStore - Global store for saved real estate properties
 *
 * Features:
 * - localStorage persistence with 'saved-properties' key
 * - Automatic timestamps for created/updated dates
 * - Duplicate property support
 * - Bulk operations (clear all)
 */
export const useSavedPropertiesStore = create<SavedPropertiesStore>()(
  persist(
    (set, get) => ({
      properties: [],
      sliderRanges: {},

      /**
       * Save a new property
       * @returns The ID of the newly created property
       */
      saveProperty: (name, inputs) => {
        const id = generateId();
        const now = Date.now();

        const newProperty: SavedProperty = {
          id,
          name,
          inputs,
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          properties: [...state.properties, newProperty],
        }));

        return id;
      },

      /**
       * Update an existing property
       */
      updateProperty: (id, name, inputs) => {
        set((state) => ({
          properties: state.properties.map((prop) =>
            prop.id === id
              ? {
                  ...prop,
                  name,
                  inputs,
                  updatedAt: Date.now(),
                }
              : prop
          ),
        }));
      },

      /**
       * Delete a property by ID
       */
      deleteProperty: (id) => {
        set((state) => ({
          properties: state.properties.filter((prop) => prop.id !== id),
        }));
      },

      /**
       * Get a single property by ID
       */
      getProperty: (id) => {
        return get().properties.find((prop) => prop.id === id);
      },

      /**
       * Duplicate an existing property
       * @returns The ID of the duplicated property, or undefined if source not found
       */
      duplicateProperty: (id) => {
        const source = get().properties.find((prop) => prop.id === id);

        if (!source) {
          return undefined;
        }

        const newId = generateId();
        const now = Date.now();

        const duplicated: SavedProperty = {
          id: newId,
          name: `${source.name} (Copy)`,
          inputs: { ...source.inputs },
          createdAt: now,
          updatedAt: now,
        };

        set((state) => ({
          properties: [...state.properties, duplicated],
        }));

        return newId;
      },

      /**
       * Rename a property
       */
      renameProperty: (id, newName) => {
        set((state) => ({
          properties: state.properties.map((prop) =>
            prop.id === id
              ? {
                  ...prop,
                  name: newName,
                  updatedAt: Date.now(),
                }
              : prop
          ),
        }));
      },

      /**
       * Clear all saved properties
       */
      clearAll: () => {
        set({ properties: [] });
      },

      /**
       * Set a custom min or max for a slider
       */
      setSliderRange: (key, field, value) => {
        set((state) => ({
          sliderRanges: {
            ...state.sliderRanges,
            [key]: { ...state.sliderRanges[key], [field]: value },
          },
        }));
      },

      /**
       * Reset a single slider to default range
       */
      clearSliderRange: (key) => {
        set((state) => {
          const { [key]: _, ...rest } = state.sliderRanges;
          return { sliderRanges: rest };
        });
      },

      /**
       * Reset all slider ranges to defaults
       */
      clearAllSliderRanges: () => {
        set({ sliderRanges: {} });
      },

      /**
       * Export all properties to a JSON file
       * Creates a downloadable file with all saved properties
       */
      exportToJSON: () => {
        try {
          const { properties, sliderRanges } = get();

          // Create export data structure with metadata
          const exportData: ExportData = {
            properties: properties.map((prop) => ({
              id: prop.id,
              name: prop.name,
              inputs: prop.inputs,
              createdAt: dateToISOString(prop.createdAt),
              updatedAt: dateToISOString(prop.updatedAt),
            })),
            ...(Object.keys(sliderRanges).length > 0 && { sliderRanges }),
            exportDate: dateToISOString(createCurrentDate()),
            version: '1.0',
          };

          // Serialize to JSON with indentation for readability
          const dataStr = JSON.stringify(exportData, null, 2);

          // Create a Blob (binary large object)
          const dataBlob = new Blob([dataStr], { type: 'application/json' });

          // Create temporary download link
          const link = document.createElement('a');
          link.href = URL.createObjectURL(dataBlob);
          link.download = `real-estate-properties-${getDateForFilename()}.json`;

          // Programmatically trigger download
          document.body.appendChild(link);
          link.click();

          // Clean up
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        } catch (error) {
          console.error('Error exporting properties:', error);
          throw new Error('Failed to export properties');
        }
      },

      /**
       * Import properties from a JSON file
       * Validates data and merges with existing properties (skips duplicates)
       * @returns Result object with success status and counts
       */
      importFromJSON: async (file: File): Promise<ImportResult> => {
        try {
          // 1. Read file contents
          const text = await file.text();
          const importData = JSON.parse(text) as ExportData;

          // 2. Validate file structure
          if (!importData.properties || !Array.isArray(importData.properties)) {
            throw new Error('Invalid file format: missing properties array');
          }

          const existingProperties = get().properties;
          let importedCount = 0;
          let skippedCount = 0;

          // 3. Filter and validate properties
          const validProperties: SavedProperty[] = [];

          for (const prop of importData.properties) {
            // Basic validation
            if (!prop.id || !prop.name || !prop.inputs) {
              console.warn('Skipping invalid property:', prop);
              skippedCount++;
              continue;
            }

            // Validate inputs object has required fields
            if (
              typeof prop.inputs.purchasePrice !== 'number' ||
              typeof prop.inputs.monthlyRent !== 'number'
            ) {
              console.warn('Skipping property with invalid inputs:', prop);
              skippedCount++;
              continue;
            }

            // 4. Check for duplicates (by ID or by name + inputs combination)
            const isDuplicate = existingProperties.some((existing) => {
              if (existing.id === prop.id) return true;

              // Also check if name and key inputs match
              return (
                existing.name === prop.name &&
                existing.inputs.purchasePrice === prop.inputs.purchasePrice &&
                existing.inputs.monthlyRent === prop.inputs.monthlyRent &&
                existing.inputs.downPaymentPercent === prop.inputs.downPaymentPercent
              );
            });

            if (isDuplicate) {
              skippedCount++;
              continue;
            }

            // 5. Restore dates and create valid property object
            const now = createCurrentDate().getTime();
            const restoredProperty: SavedProperty = {
              id: prop.id,
              name: prop.name,
              inputs: prop.inputs,
              createdAt: getValidDate(prop.createdAt)?.getTime() || now,
              updatedAt: getValidDate(prop.updatedAt)?.getTime() || now,
            };

            validProperties.push(restoredProperty);
            importedCount++;
          }

          // 6. Merge with existing data and save
          const updates: Partial<SavedPropertiesStore> = {};
          if (validProperties.length > 0) {
            updates.properties = [...existingProperties, ...validProperties];
          }
          // 7. Restore slider range preferences if present
          if (importData.sliderRanges && typeof importData.sliderRanges === 'object') {
            updates.sliderRanges = importData.sliderRanges;
          }
          if (Object.keys(updates).length > 0) {
            set(updates);
          }

          return {
            success: true,
            imported: importedCount,
            skipped: skippedCount,
            message:
              importedCount > 0
                ? `Successfully imported ${importedCount} ${importedCount === 1 ? 'property' : 'properties'}${skippedCount > 0 ? ` (${skippedCount} duplicates skipped)` : ''}`
                : 'No new properties to import (all were duplicates)',
          };
        } catch (error) {
          console.error('Error importing properties:', error);
          return {
            success: false,
            imported: 0,
            skipped: 0,
            message:
              error instanceof Error
                ? error.message
                : 'Failed to import properties. Please check the file format.',
          };
        }
      },
    }),
    {
      name: 'saved-properties', // localStorage key
    }
  )
);
