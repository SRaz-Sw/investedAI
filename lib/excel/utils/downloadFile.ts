import * as XLSX from 'xlsx';

/**
 * Trigger browser download of an Excel workbook
 */
export function downloadExcelFile(
  workbook: XLSX.WorkBook,
  filename: string
): void {
  // Generate the Excel file as an array buffer
  const buffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
  });

  // Create a Blob from the buffer
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  // Create a download link and trigger it
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.xlsx') ? filename : `${filename}.xlsx`;

  // Append to body, click, and remove
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Clean up the URL object
  URL.revokeObjectURL(url);
}

/**
 * Generate a timestamped filename
 */
export function generateFilename(baseName: string): string {
  const date = new Date();
  const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
  return `${baseName}_${dateStr}.xlsx`;
}
