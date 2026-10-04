import MonthFilter from "./MonthFilter";

export default function ActionsBar({
  fileNames,
  allMonthsFound,
  currentMonthFilter,
  onMonthChange,
  onDownload,
  onReset,
}) {
  const fileLabel =
    fileNames.length > 0
      ? `📄 Loaded ${fileNames.length} file${fileNames.length > 1 ? "s" : ""}: ${fileNames.join(", ")}`
      : "File Loaded";

  return (
    <div className="actions-bar" id="actionsBar">
      <div style={{ fontWeight: 500, color: "var(--text-main)" }}>{fileLabel}</div>
      <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
        <MonthFilter
          allMonthsFound={allMonthsFound}
          currentMonthFilter={currentMonthFilter}
          onChange={onMonthChange}
        />
        <button className="btn btn-download" onClick={onDownload}>
          📥 Download Excel Report
        </button>
        <button className="btn btn-reset" onClick={onReset}>
          🔄 Reset Tool
        </button>
      </div>
    </div>
  );
}
