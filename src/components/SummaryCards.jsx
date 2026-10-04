export default function SummaryCards({ processedData }) {
  const {
    totalDeptCount,
    billNotPreparedRows,
    billPreparedRows,
    billPrepNotRecRows,
    totalAmountSum,
    monthsFound,
  } = processedData;

  return (
    <div className="grid" id="cardsGrid">
      <div className="card card-1">
        <div className="card-title">1. Total Dept</div>
        <div className="card-value">{totalDeptCount.toLocaleString("en-US")}</div>
      </div>
      <div className="card card-2">
        <div className="card-title">2. Bill Not Prepared</div>
        <div className="card-value">{billNotPreparedRows.length.toLocaleString("en-US")}</div>
      </div>
      <div className="card card-3">
        <div className="card-title">3. Bill Prepared</div>
        <div className="card-value">{billPreparedRows.length.toLocaleString("en-US")}</div>
      </div>
      <div className="card card-4">
        <div className="card-title">4. Bill Prepared But Paytment Not Rec</div>
        <div className="card-value">{billPrepNotRecRows.length.toLocaleString("en-US")}</div>
      </div>
      <div className="card card-5">
        <div className="card-title">5. Total Amount</div>
        <div className="card-value">
          ₹{totalAmountSum.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 })}
        </div>
      </div>
      <div className="card card-6">
        <div className="card-title">6. Months Covered</div>
        <div className="card-value" style={{ fontSize: "1.1rem", lineHeight: 1.5 }}>
          {monthsFound.length > 0 ? monthsFound.join(", ") : "No month/date column found"}
        </div>
      </div>
    </div>
  );
}
