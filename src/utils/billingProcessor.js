import { findKey, getMonthLabel, sortMonths, MONTH_COLUMN_CANDIDATES } from "./monthUtils";

const INVOICE_COLUMN_CANDIDATES = [
  "AgencyInvoiceUploded",
  "AgencyInvoiceUploaded",
  "Agency Invoice Uploded",
  "Agency Invoice Uploaded",
];

const GST_COLUMN_CANDIDATES = [
  "CedmapToAgencyWithoutGST",
  "Cedmap To Agency Without GST",
  "CedmapToAgencyWithoutGst",
];

/**
 * Detects the key columns (invoice status, amount, month/date) from a
 * sample row. Returns null for any column it couldn't find.
 */
export function detectColumns(sampleRow) {
  return {
    colInvoiceUploaded: findKey(sampleRow, INVOICE_COLUMN_CANDIDATES),
    colWithoutGST: findKey(sampleRow, GST_COLUMN_CANDIDATES),
    colMonth: findKey(sampleRow, MONTH_COLUMN_CANDIDATES),
  };
}

/** Extracts a "Mon YYYY" label for one row, given the detected month column. */
export function getRowMonth(row, colMonth) {
  if (!colMonth) return null;
  return getMonthLabel(row[colMonth]);
}

/** Collects every unique month present across all rows, sorted chronologically. */
export function collectAllMonths(rows, colMonth) {
  if (!colMonth) return [];
  const monthsSet = new Set();
  rows.forEach((row) => {
    const label = getMonthLabel(row[colMonth]);
    if (label) monthsSet.add(label);
  });
  return sortMonths(Array.from(monthsSet));
}

/**
 * Categorizes a set of rows into:
 *  - billNotPreparedRows   (AgencyInvoiceUploaded = "No")
 *  - billPreparedRows      (AgencyInvoiceUploaded = "Yes")
 *  - billPrepNotRecRows    (= "Yes" but amount is 0 / blank)
 *  - totalAmountSum        (sum of all non-zero amounts)
 */
export function computeStats(rows, colInvoiceUploaded, colWithoutGST) {
  const stats = {
    totalDeptCount: rows.length,
    billNotPreparedRows: [],
    billPreparedRows: [],
    billPrepNotRecRows: [],
    totalAmountSum: 0,
  };

  rows.forEach((row) => {
    const invoiceVal = String(row[colInvoiceUploaded] || "").trim().toLowerCase();
    const rawGstVal = row[colWithoutGST];

    let gstNum = 0;
    if (typeof rawGstVal === "number") {
      gstNum = rawGstVal;
    } else {
      const cleanStr = String(rawGstVal || "").replace(/[^0-9.-]+/g, "");
      gstNum = parseFloat(cleanStr) || 0;
    }

    if (invoiceVal === "no") {
      stats.billNotPreparedRows.push(row);
    }

    if (invoiceVal === "yes") {
      stats.billPreparedRows.push(row);
      if (gstNum === 0 || String(rawGstVal).trim() === "0") {
        stats.billPrepNotRecRows.push(row);
      }
    }

    if (gstNum !== 0) {
      stats.totalAmountSum += gstNum;
    }
  });

  return stats;
}
