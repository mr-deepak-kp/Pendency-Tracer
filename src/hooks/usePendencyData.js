import { useState, useCallback, useRef } from "react";
import { readAndCombineFiles } from "../utils/excelReader";
import {
  detectColumns,
  getRowMonth,
  collectAllMonths,
  computeStats,
} from "../utils/billingProcessor";
import { downloadStyledExcel } from "../utils/excelExporter";

const EMPTY_STATS = {
  totalDeptCount: 0,
  billNotPreparedRows: [],
  billPreparedRows: [],
  billPrepNotRecRows: [],
  totalAmountSum: 0,
  monthsFound: [],
};

export function usePendencyData() {
  const [fileNames, setFileNames] = useState([]);
  const [allMonthsFound, setAllMonthsFound] = useState([]);
  const [currentMonthFilter, setCurrentMonthFilter] = useState("ALL");
  const [processedData, setProcessedData] = useState(EMPTY_STATS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);

  // Raw data + detected columns don't need to trigger re-renders by themselves,
  // but we keep them in refs so render(filter) can recompute without re-reading files.
  const rawDataRef = useRef([]);
  const columnsRef = useRef({ colInvoiceUploaded: null, colWithoutGST: null, colMonth: null });

  const renderForFilter = useCallback((filterValue) => {
    const rawData = rawDataRef.current;
    const { colInvoiceUploaded, colWithoutGST, colMonth } = columnsRef.current;

    const filteredRows =
      filterValue === "ALL"
        ? rawData
        : rawData.filter((row) => getRowMonth(row, colMonth) === filterValue);

    const stats = computeStats(filteredRows, colInvoiceUploaded, colWithoutGST);

    setProcessedData({
      ...stats,
      monthsFound:
        filterValue === "ALL"
          ? collectAllMonths(rawData, colMonth)
          : [filterValue],
    });
  }, []);

  const loadFiles = useCallback(
    async (fileList) => {
      setError(null);
      const files = Array.from(fileList);
      if (!files.length) return;

      setFileNames(files.map((f) => f.name));

      try {
        const combined = await readAndCombineFiles(files);
        if (!combined.length) {
          setError("No data found in the uploaded sheet(s)!");
          return;
        }

        const sampleRow = combined[0];
        const columns = detectColumns(sampleRow);
        columnsRef.current = columns;
        rawDataRef.current = combined;

        if (!columns.colInvoiceUploaded || !columns.colWithoutGST) {
          setError(
            `Required columns missing! Please ensure the sheet(s) contain 'AgencyInvoiceUploaded' and 'CedmapToAgencyWithoutGST'. Found Columns: ${Object.keys(
              sampleRow
            ).join(", ")}`
          );
        }

        const months = collectAllMonths(combined, columns.colMonth);
        setAllMonthsFound(months);
        setCurrentMonthFilter("ALL");
        setIsLoaded(true);
        renderForFilter("ALL");
      } catch (err) {
        setError("Error reading Excel file(s): " + err.message);
      }
    },
    [renderForFilter]
  );

  const applyMonthFilter = useCallback(
    (value) => {
      setCurrentMonthFilter(value);
      renderForFilter(value);
    },
    [renderForFilter]
  );

  const download = useCallback(async () => {
    if (!rawDataRef.current.length) {
      setError("No data available to download!");
      return;
    }
    try {
      const filterLabel = currentMonthFilter === "ALL" ? "All Months" : currentMonthFilter;
      await downloadStyledExcel(processedData, filterLabel);
    } catch (err) {
      setError("Failed to generate Excel download: " + err.message);
    }
  }, [processedData, currentMonthFilter]);

  const reset = useCallback(() => {
    rawDataRef.current = [];
    columnsRef.current = { colInvoiceUploaded: null, colWithoutGST: null, colMonth: null };
    setFileNames([]);
    setAllMonthsFound([]);
    setCurrentMonthFilter("ALL");
    setProcessedData(EMPTY_STATS);
    setIsLoaded(false);
    setError(null);
  }, []);

  return {
    fileNames,
    allMonthsFound,
    currentMonthFilter,
    processedData,
    isLoaded,
    error,
    loadFiles,
    applyMonthFilter,
    download,
    reset,
  };
}
