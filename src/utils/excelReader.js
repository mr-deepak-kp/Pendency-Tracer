import * as XLSX from "xlsx";

/**
 * Reads one File object (from an <input type="file"> or drag-drop)
 * and resolves with its first sheet's rows as an array of objects.
 */
export function readWorkbookRows(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array", cellDates: true });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const json = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        resolve(json);
      } catch (err) {
        reject(new Error(`${file.name}: ${err.message}`));
      }
    };
    reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Reads multiple files in parallel and returns a single combined
 * array of rows (all files merged together).
 */
export async function readAndCombineFiles(fileList) {
  const files = Array.from(fileList);
  const resultsArray = await Promise.all(files.map(readWorkbookRows));
  return [].concat(...resultsArray);
}
