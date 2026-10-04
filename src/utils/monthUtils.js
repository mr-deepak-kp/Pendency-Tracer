import * as XLSX from "xlsx";

/**
 * Finds a column key in a row object by trying a list of possible
 * header names (case-insensitive, trims whitespace).
 */
export function findKey(row, possibleNames) {
  const keys = Object.keys(row);
  for (const p of possibleNames) {
    const match = keys.find((k) => k.trim().toLowerCase() === p.toLowerCase());
    if (match) return match;
  }
  return null;
}

/**
 * Converts a date / text cell value into a short "Mon YYYY" label.
 * Handles JS Date objects (from cellDates: true), Excel serial numbers,
 * and plain text month values.
 */
export function getMonthLabel(val) {
  if (val === null || val === undefined || val === "") return null;

  if (val instanceof Date && !isNaN(val)) {
    return val.toLocaleString("en-US", { month: "short", year: "numeric" });
  }

  if (typeof val === "number") {
    // Excel serial date fallback (in case cellDates parsing missed it)
    const parsedCode = XLSX.SSF.parse_date_code(val);
    if (parsedCode) {
      const d = new Date(parsedCode.y, parsedCode.m - 1, parsedCode.d);
      return d.toLocaleString("en-US", { month: "short", year: "numeric" });
    }
    return null;
  }

  const str = String(val).trim();
  if (!str) return null;

  const parsed = new Date(str);
  if (!isNaN(parsed) && /\d/.test(str)) {
    return parsed.toLocaleString("en-US", { month: "short", year: "numeric" });
  }

  // Fallback: use the raw text as-is (e.g. "August", "Aug-25")
  return str;
}

/** Sorts "Mon YYYY" labels chronologically, falling back to alphabetical. */
export function sortMonths(months) {
  return months.slice().sort((a, b) => {
    const da = Date.parse("1 " + a);
    const db = Date.parse("1 " + b);
    if (!isNaN(da) && !isNaN(db)) return da - db;
    return a.localeCompare(b);
  });
}

/** Column names we search for when looking for a month/date column. */
export const MONTH_COLUMN_CANDIDATES = [
  "Month",
  "Bill Month",
  "BillMonth",
  "Billing Month",
  "BillingMonth",
  "Period",
  "Date",
  "Bill Date",
  "BillDate",
  "Invoice Date",
  "InvoiceDate",
  "Invoice Month",
  "InvoiceMonth",
];
