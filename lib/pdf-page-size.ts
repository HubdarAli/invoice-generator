/** ~80mm thermal receipt width in PDF points */
export const THERMAL_PDF_WIDTH = 226;

/** Omit height so the page ends where content ends */
export const thermalPdfPageSize = { width: THERMAL_PDF_WIDTH } as const;
