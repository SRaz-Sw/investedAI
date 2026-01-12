import * as XLSX from 'xlsx';
import type { ExcelBuilderOptions, ExcelTranslations } from './types';
import { excelTranslations } from './translations';
import { downloadExcelFile, generateFilename } from './utils/downloadFile';
import { buildDashboardSheet } from './sheets/dashboardSheet';
import { buildAmortizationSheet } from './sheets/amortizationSheet';
import { buildMonthlyCashFlowSheet } from './sheets/monthlyCashFlowSheet';
import { buildYearlySummarySheet } from './sheets/yearlySummarySheet';
import { buildStockComparisonSheet } from './sheets/stockComparisonSheet';
import { buildReinvestmentSheet } from './sheets/reinvestmentSheet';
import { buildChartDataSheet } from './sheets/chartDataSheet';

/**
 * Main Excel builder class for Real Estate Calculator export
 */
export class RealEstateExcelBuilder {
  private workbook: XLSX.WorkBook;
  private options: ExcelBuilderOptions;
  private translations: ExcelTranslations;

  constructor(options: ExcelBuilderOptions) {
    this.options = options;
    this.translations = excelTranslations[options.language];
    this.workbook = XLSX.utils.book_new();
  }

  /**
   * Build the complete workbook with all sheets
   */
  public build(): XLSX.WorkBook {
    const t = this.translations;

    // Build all sheets
    const dashboardSheet = buildDashboardSheet(this.options, t);
    const amortizationSheet = buildAmortizationSheet(this.options, t);
    const monthlyCashFlowSheet = buildMonthlyCashFlowSheet(this.options, t);
    const yearlySummarySheet = buildYearlySummarySheet(this.options, t);
    const stockComparisonSheet = buildStockComparisonSheet(this.options, t);
    const reinvestmentSheet = buildReinvestmentSheet(this.options, t);
    const chartDataSheet = buildChartDataSheet(this.options, t);

    // Add sheets to workbook in order
    XLSX.utils.book_append_sheet(this.workbook, dashboardSheet, t.sheetDashboard);
    XLSX.utils.book_append_sheet(this.workbook, amortizationSheet, t.sheetAmortization);
    XLSX.utils.book_append_sheet(this.workbook, monthlyCashFlowSheet, t.sheetMonthlyCashFlow);
    XLSX.utils.book_append_sheet(this.workbook, yearlySummarySheet, t.sheetYearlySummary);
    XLSX.utils.book_append_sheet(this.workbook, stockComparisonSheet, t.sheetStockComparison);
    XLSX.utils.book_append_sheet(this.workbook, reinvestmentSheet, t.sheetReinvestment);
    XLSX.utils.book_append_sheet(this.workbook, chartDataSheet, t.sheetChartData);

    // Set RTL for Hebrew
    if (this.options.language === 'he') {
      this.workbook.Workbook = this.workbook.Workbook || {};
      this.workbook.Workbook.Views = [{ RTL: true }];
    }

    return this.workbook;
  }

  /**
   * Download the workbook as an Excel file
   */
  public download(filename?: string): void {
    const name = filename || generateFilename('real-estate-analysis');
    downloadExcelFile(this.workbook, name);
  }

  /**
   * Get the workbook for further manipulation
   */
  public getWorkbook(): XLSX.WorkBook {
    return this.workbook;
  }
}
