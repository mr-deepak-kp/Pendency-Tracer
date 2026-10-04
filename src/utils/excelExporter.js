// NOTE: xlsx-populate's default npm entry point targets Node.js (uses fs, etc).
// We import the pre-bundled browser build explicitly so it works inside Vite/React.
import XlsxPopulate from "xlsx-populate/browser/xlsx-populate.min.js";

const HEADER_FILL = "DCE6F1";
const ZEBRA_FILL = "F2F7FC";
const BORDER = { style: "thin", color: "B8C7D9" };

/** Excel sheet names: max 31 chars, no : \ / ? * [ ] */
export function safeSheetName(name) {
  return String(name).replace(/[:\\/?*[\]]/g, "").substring(0, 31);
}

function styleHeaderRow(sheet, rowNum, colCount) {
  sheet.range(rowNum, 1, rowNum, colCount).style({
    bold: true,
    fill: HEADER_FILL,
    border: BORDER,
  });
}

function styleDataCell(sheet, rowNum, colNum, zebra) {
  sheet.cell(rowNum, colNum).style({
    fill: zebra ? ZEBRA_FILL : "FFFFFF",
    border: BORDER,
  });
}

function autoWidth(sheet, colCount, rows) {
  for (let c = 1; c <= colCount; c++) {
    let maxLen = 10;
    rows.forEach((r) => {
      const val = r[c - 1];
      const len = val === null || val === undefined ? 0 : String(val).length;
      if (len > maxLen) maxLen = len;
    });
    sheet.column(c).width(Math.min(maxLen + 3, 45));
  }
}

function collectHeaders(rows) {
  const headers = [];
  const seen = new Set();
  rows.forEach((r) => {
    Object.keys(r).forEach((k) => {
      if (!seen.has(k)) {
        seen.add(k);
        headers.push(k);
      }
    });
  });
  return headers;
}

function addDataSheet(wb, name, rows) {
  const sheet = wb.addSheet(safeSheetName(name));
  if (!rows || rows.length === 0) {
    sheet.cell("A1").value("No Records Found");
    sheet.cell("A1").style({ bold: true });
    return;
  }
  const headers = collectHeaders(rows);
  headers.forEach((h, i) => sheet.cell(1, i + 1).value(h));
  styleHeaderRow(sheet, 1, headers.length);

  const bodyRows = rows.map((r) => headers.map((h) => r[h]));
  bodyRows.forEach((r, ri) => {
    r.forEach((val, ci) => {
      sheet.cell(ri + 2, ci + 1).value(val === undefined ? "" : val);
      styleDataCell(sheet, ri + 2, ci + 1, ri % 2 === 0);
    });
  });
  autoWidth(sheet, headers.length, [headers, ...bodyRows]);
}

/**
 * Builds a styled workbook (light header colors, zebra rows, thin
 * borders, no filters) from the processed stats for the currently
 * selected month filter, and triggers a browser download.
 */
export async function downloadStyledExcel(processedData, filterLabel) {
  const wb = await XlsxPopulate.fromBlankAsync();

  // 1. Summary sheet
  const summarySheet = wb.sheet(0);
  summarySheet.name(safeSheetName("Summary Overview"));

  summarySheet.cell("A1").value(`Pendency Tracing Tools - Summary Report (${filterLabel})`);
  summarySheet.range("A1:B1").merged(true);
  summarySheet.cell("A1").style({ bold: true, fontSize: 13 });

  const summaryHeaderRow = 3;
  summarySheet.cell(summaryHeaderRow, 1).value("Metric Name");
  summarySheet.cell(summaryHeaderRow, 2).value("Count / Value");
  styleHeaderRow(summarySheet, summaryHeaderRow, 2);

  const summaryRows = [
    ["Toatal Dept", processedData.totalDeptCount],
    ["Bill Not Prepared", processedData.billNotPreparedRows.length],
    ["Bill Prepared", processedData.billPreparedRows.length],
    ["Bill Prepared But Paytment Not Rec", processedData.billPrepNotRecRows.length],
    ["Total Amount", processedData.totalAmountSum],
    [
      "Months Covered",
      processedData.monthsFound.length > 0 ? processedData.monthsFound.join(", ") : "N/A",
    ],
  ];

  summaryRows.forEach((r, i) => {
    const rowNum = summaryHeaderRow + 1 + i;
    summarySheet.cell(rowNum, 1).value(r[0]);
    summarySheet.cell(rowNum, 2).value(r[1]);
    styleDataCell(summarySheet, rowNum, 1, i % 2 === 0);
    styleDataCell(summarySheet, rowNum, 2, i % 2 === 0);
  });

  autoWidth(summarySheet, 2, summaryRows);

  // 2-4. Data sheets
  addDataSheet(wb, "Bill Not Prepared", processedData.billNotPreparedRows);
  addDataSheet(wb, "Bill Prepared", processedData.billPreparedRows);
  addDataSheet(wb, "Bill Prep - Payment Not Rec", processedData.billPrepNotRecRows);

  const blob = await wb.outputAsync();
  const url = URL.createObjectURL(blob);
  const safeFilterLabel = filterLabel.replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  const a = document.createElement("a");
  a.href = url;
  a.download = `Pendency_Tracing_Report_${safeFilterLabel}.xlsx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
