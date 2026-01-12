import type { Language } from '@/lib/translations';

/**
 * Cell style interface matching xlsx library
 */
export interface CellStyle {
  fill?: {
    patternType?: string;
    fgColor?: { rgb: string };
    bgColor?: { rgb: string };
  };
  font?: {
    bold?: boolean;
    italic?: boolean;
    color?: { rgb: string };
    sz?: number;
    name?: string;
  };
  numFmt?: string;
  alignment?: {
    horizontal?: 'left' | 'center' | 'right';
    vertical?: 'top' | 'center' | 'bottom';
    wrapText?: boolean;
  };
  border?: {
    top?: { style: string; color: { rgb: string } };
    bottom?: { style: string; color: { rgb: string } };
    left?: { style: string; color: { rgb: string } };
    right?: { style: string; color: { rgb: string } };
  };
}

/**
 * Predefined styles for the Excel export
 */
export const STYLES = {
  // Yellow background for editable input cells
  INPUT_EDITABLE: {
    fill: {
      patternType: 'solid',
      fgColor: { rgb: 'FFFFCC' },
    },
    border: {
      top: { style: 'thin', color: { rgb: 'CCCCCC' } },
      bottom: { style: 'thin', color: { rgb: 'CCCCCC' } },
      left: { style: 'thin', color: { rgb: 'CCCCCC' } },
      right: { style: 'thin', color: { rgb: 'CCCCCC' } },
    },
  } as CellStyle,

  // Green text for positive values
  POSITIVE_VALUE: {
    font: { color: { rgb: '008000' } },
  } as CellStyle,

  // Red text for negative values
  NEGATIVE_VALUE: {
    font: { color: { rgb: 'FF0000' } },
  } as CellStyle,

  // Header style with gray background and bold
  HEADER: {
    font: { bold: true, color: { rgb: '333333' } },
    fill: {
      patternType: 'solid',
      fgColor: { rgb: 'E0E0E0' },
    },
    alignment: { horizontal: 'center' },
  } as CellStyle,

  // Section title style
  SECTION_TITLE: {
    font: { bold: true, sz: 14, color: { rgb: '1a1a1a' } },
    fill: {
      patternType: 'solid',
      fgColor: { rgb: 'D4E6F1' },
    },
  } as CellStyle,

  // Label style (left column)
  LABEL: {
    font: { color: { rgb: '666666' } },
    alignment: { horizontal: 'left' },
  } as CellStyle,

  // Calculated value style
  CALCULATED: {
    fill: {
      patternType: 'solid',
      fgColor: { rgb: 'F5F5F5' },
    },
  } as CellStyle,

  // Summary/total row style
  SUMMARY: {
    font: { bold: true },
    fill: {
      patternType: 'solid',
      fgColor: { rgb: 'E8F4E8' },
    },
    border: {
      top: { style: 'medium', color: { rgb: '888888' } },
    },
  } as CellStyle,

  // Winner highlight (green background)
  WINNER: {
    font: { bold: true, color: { rgb: '006600' } },
    fill: {
      patternType: 'solid',
      fgColor: { rgb: 'D4EDDA' },
    },
  } as CellStyle,
} as const;

/**
 * Number format strings for Excel
 */
export const NUMBER_FORMATS = {
  CURRENCY_USD: '$#,##0.00',
  CURRENCY_USD_NO_CENTS: '$#,##0',
  CURRENCY_ILS: '#,##0.00 ₪',
  CURRENCY_ILS_NO_CENTS: '#,##0 ₪',
  PERCENT: '0.00%',
  PERCENT_ONE_DECIMAL: '0.0%',
  NUMBER: '#,##0',
  NUMBER_TWO_DECIMAL: '#,##0.00',
} as const;

/**
 * Get currency format based on language
 */
export function getCurrencyFormat(language: Language, includeCents = true): string {
  if (language === 'he') {
    return includeCents ? NUMBER_FORMATS.CURRENCY_ILS : NUMBER_FORMATS.CURRENCY_ILS_NO_CENTS;
  }
  return includeCents ? NUMBER_FORMATS.CURRENCY_USD : NUMBER_FORMATS.CURRENCY_USD_NO_CENTS;
}

/**
 * Get appropriate style based on value (positive/negative)
 */
export function getValueStyle(value: number): CellStyle {
  if (value > 0) return STYLES.POSITIVE_VALUE;
  if (value < 0) return STYLES.NEGATIVE_VALUE;
  return {};
}

/**
 * Column widths for different data types
 */
export const COLUMN_WIDTHS = {
  NARROW: 8,      // For month/year numbers
  MEDIUM: 12,     // For percentages
  STANDARD: 15,   // For most values
  WIDE: 20,       // For currency values
  EXTRA_WIDE: 25, // For labels/descriptions
} as const;
