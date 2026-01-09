/**
 * Real Estate Calculator V2 - URL State Management Hook
 * 
 * This hook manages URL parameters for sharing calculator state.
 * It provides functions to:
 * 1. Parse URL parameters on mount
 * 2. Update URL when inputs change (without page reload)
 * 3. Generate shareable URLs
 * 4. Copy URLs to clipboard
 */

import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import type { RealEstateInputs } from '../types';
import { URL_KEYS, DEFAULT_INPUTS } from '../types';

// Reverse mapping for parsing URL params
const REVERSE_URL_KEYS = Object.fromEntries(
  Object.entries(URL_KEYS).map(([k, v]) => [v, k])
) as Record<string, keyof RealEstateInputs>;

interface UseUrlStateResult {
  initialInputs: RealEstateInputs;
  generateShareUrl: (inputs: RealEstateInputs) => string;
  updateUrl: (inputs: RealEstateInputs) => void;
  copyShareUrl: (inputs: RealEstateInputs) => Promise<boolean>;
}

/**
 * Custom hook for URL state management.
 */
export function useUrlState(): UseUrlStateResult {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const isInitialMount = useRef(true);
  
  // Parse URL params on mount
  const initialInputs = useMemo((): RealEstateInputs => {
    const inputs = { ...DEFAULT_INPUTS };
    
    searchParams.forEach((value, key) => {
      const inputKey = REVERSE_URL_KEYS[key];
      if (inputKey) {
        const parsed = parseFloat(value);
        if (!isNaN(parsed)) {
          (inputs as any)[inputKey] = parsed;
        }
      }
    });
    
    return inputs;
  }, []); // Only parse on mount
  
  // Generate shareable URL from current inputs
  const generateShareUrl = useCallback((inputs: RealEstateInputs): string => {
    const params = new URLSearchParams();
    
    // Only include non-default values to keep URL short
    (Object.keys(inputs) as Array<keyof RealEstateInputs>).forEach((key) => {
      if (inputs[key] !== DEFAULT_INPUTS[key]) {
        params.set(URL_KEYS[key], String(inputs[key]));
      }
    });
    
    const queryString = params.toString();
    const baseUrl = typeof window !== 'undefined' 
      ? `${window.location.origin}${pathname}`
      : pathname;
    
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  }, [pathname]);
  
  // Update URL when inputs change (without page reload)
  const updateUrl = useCallback((inputs: RealEstateInputs) => {
    // Skip on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    const url = generateShareUrl(inputs);
    
    // Use replaceState to update URL without adding to history
    if (typeof window !== 'undefined') {
      window.history.replaceState({}, '', url);
    }
  }, [generateShareUrl]);
  
  // Copy URL to clipboard
  const copyShareUrl = useCallback(async (inputs: RealEstateInputs): Promise<boolean> => {
    const url = generateShareUrl(inputs);
    
    try {
      await navigator.clipboard.writeText(url);
      return true;
    } catch {
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = url;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch {
        return false;
      }
    }
  }, [generateShareUrl]);
  
  return {
    initialInputs,
    generateShareUrl,
    updateUrl,
    copyShareUrl,
  };
}

/**
 * Custom hook for debouncing values.
 * Useful for debouncing rapid slider changes.
 */
export function useDebouncedValue<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  
  return debouncedValue;
}

