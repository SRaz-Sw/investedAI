/**
 * Date Utilities for Export/Import
 *
 * Provides robust date handling for JSON serialization/deserialization.
 * Ensures dates are preserved correctly during export/import operations.
 */

export type DateInput = Date | string | number | null | undefined;

/**
 * Create a new Date object representing the current time
 */
export function createCurrentDate(): Date {
  return new Date();
}

/**
 * Convert a date to ISO string format for JSON serialization
 * @param dateInput - Date object, string, number, or null/undefined
 * @returns ISO 8601 date string (e.g., "2024-01-15T14:30:00.000Z")
 */
export function dateToISOString(dateInput: DateInput): string {
  const date = getValidDateWithFallback(dateInput);
  return date.toISOString();
}

/**
 * Parse various date formats and return a valid Date object or null
 * Handles: Date objects, ISO strings, timestamps (seconds/milliseconds)
 *
 * @param dateInput - Date in various formats
 * @returns Valid Date object or null if parsing fails
 */
export function getValidDate(dateInput: DateInput): Date | null {
  // Handle null/undefined
  if (dateInput == null) {
    return null;
  }

  // Already a Date object
  if (dateInput instanceof Date) {
    return isNaN(dateInput.getTime()) ? null : dateInput;
  }

  // Handle ISO strings
  if (typeof dateInput === 'string') {
    if (dateInput.trim() === '') return null;
    const parsed = new Date(dateInput);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  // Handle timestamps (seconds or milliseconds)
  if (typeof dateInput === 'number') {
    if (!isFinite(dateInput) || dateInput < 0) return null;
    // Convert seconds to milliseconds if needed (timestamps < 10000000000 are likely seconds)
    const timestamp = dateInput < 10000000000 ? dateInput * 1000 : dateInput;
    const parsed = new Date(timestamp);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  return null;
}

/**
 * Get a valid Date object with automatic fallback to current date
 * Never returns null - always returns a valid Date
 *
 * @param dateInput - Date in various formats
 * @returns Valid Date object (current date if parsing fails)
 */
export function getValidDateWithFallback(dateInput: DateInput): Date {
  const validDate = getValidDate(dateInput);
  return validDate || new Date();
}

/**
 * Restore a Date object from storage (handles various serialized formats)
 * Used when reading data from localStorage/storage that may have serialized Date objects
 *
 * @param storedDate - Date value from storage (can be string, number, object, etc.)
 * @returns Valid Date object (fallback to current date if restoration fails)
 */
export function restoreDateFromStorage(storedDate: any): Date {
  // Handle missing dates
  if (storedDate == null) {
    console.warn('Missing date in storage, using current date as fallback');
    return new Date();
  }

  // Already a Date object
  if (storedDate instanceof Date) {
    return isNaN(storedDate.getTime()) ? new Date() : storedDate;
  }

  // ISO string (main case for exported data)
  if (typeof storedDate === 'string') {
    const parsed = getValidDate(storedDate);
    if (parsed) return parsed;
    console.error('Failed to parse stored date string:', storedDate);
    return new Date();
  }

  // Handle storage-serialized Date objects (from Chrome/browser storage)
  if (typeof storedDate === 'object' && storedDate !== null) {
    // Try various methods to extract the date
    if (typeof storedDate.getTime === 'function') {
      try {
        return new Date(storedDate.getTime());
      } catch (e) {
        console.error('Failed to restore Date-like object:', e);
        return new Date();
      }
    }

    if (storedDate.toISOString) {
      try {
        return new Date(storedDate.toISOString());
      } catch (e) {
        // Continue to next attempt
      }
    }
  }

  // Timestamp
  if (typeof storedDate === 'number') {
    const parsed = getValidDate(storedDate);
    if (parsed) return parsed;
  }

  // Fallback
  console.error('Could not restore date from storage:', storedDate);
  return new Date();
}

/**
 * Format a date for use in filenames (YYYY-MM-DD format)
 * @param date - Optional date (defaults to current date)
 * @returns Date string in YYYY-MM-DD format
 */
export function getDateForFilename(date?: Date): string {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Format a date for display (locale-aware)
 * @param dateInput - Date in various formats
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted date string
 */
export function formatDateForDisplay(
  dateInput: DateInput,
  locale: string = 'en-US'
): string {
  const date = getValidDateWithFallback(dateInput);
  return date.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format a date with time for display (locale-aware)
 * @param dateInput - Date in various formats
 * @param locale - Locale string (default: 'en-US')
 * @returns Formatted date and time string
 */
export function formatDateTimeForDisplay(
  dateInput: DateInput,
  locale: string = 'en-US'
): string {
  const date = getValidDateWithFallback(dateInput);
  return date.toLocaleString(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
