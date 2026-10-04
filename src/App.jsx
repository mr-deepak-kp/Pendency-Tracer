import { usePendencyData } from "./hooks/usePendencyData";
import UploadArea from "./components/UploadArea";
import ActionsBar from "./components/ActionsBar";
import SummaryCards from "./components/SummaryCards";
import SummaryTable from "./components/SummaryTable";
import "./App.css";

export default function App() {
  const {
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
  } = usePendencyData();

  return (
    <div className="container">
      <header>
        <h1>Pendency Tracing Tools</h1>
        <p>Upload your Excel file to automatically generate summary metrics and exported sheets</p>
      </header>

      <UploadArea onFilesSelected={loadFiles} />

      {error && (
        <div className="error-banner" role="alert">
          ⚠️ {error}
        </div>
      )}

      {isLoaded && (
        <>
          <ActionsBar
            fileNames={fileNames}
            allMonthsFound={allMonthsFound}
            currentMonthFilter={currentMonthFilter}
            onMonthChange={applyMonthFilter}
            onDownload={download}
            onReset={reset}
          />
          <SummaryCards processedData={processedData} />
          <SummaryTable processedData={processedData} currentMonthFilter={currentMonthFilter} />
        </>
      )}
    </div>
  );
}
