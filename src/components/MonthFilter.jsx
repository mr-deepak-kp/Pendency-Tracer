export default function MonthFilter({ allMonthsFound, currentMonthFilter, onChange }) {
  if (!allMonthsFound.length) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <label htmlFor="monthSelect" style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)" }}>
        Month:
      </label>
      <select
        id="monthSelect"
        value={currentMonthFilter}
        onChange={(e) => onChange(e.target.value)}
        style={{
          padding: "0.5rem 0.75rem",
          borderRadius: "0.5rem",
          border: "1px solid var(--border)",
          fontWeight: 500,
          fontSize: "0.9rem",
        }}
      >
        <option value="ALL">All Months</option>
        {allMonthsFound.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
}
