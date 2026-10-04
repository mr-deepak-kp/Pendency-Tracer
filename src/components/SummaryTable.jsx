export default function SummaryTable({ processedData, currentMonthFilter }) {
  const {
    totalDeptCount,
    billNotPreparedRows,
    billPreparedRows,
    billPrepNotRecRows,
    totalAmountSum,
  } = processedData;

  const titleSuffix = currentMonthFilter === "ALL" ? " (All Months)" : ` — ${currentMonthFilter}`;

  return (
    <div className="summary-section" id="summarySection">
      <div className="section-title">Summary Dashboard Overview{titleSuffix}</div>
      <div className="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Metric Name</th>
              <th>Count / Value</th>
              <th>Target Sheet Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Toatal Dept</strong></td>
              <td><strong>{totalDeptCount}</strong></td>
              <td>Summary Overview</td>
            </tr>
            <tr>
              <td><strong>Bill Not Prepared</strong></td>
              <td><strong>{billNotPreparedRows.length}</strong></td>
              <td><span className="badge badge-no">Bill Not Prepared</span></td>
            </tr>
            <tr>
              <td><strong>Bill Prepared</strong></td>
              <td><strong>{billPreparedRows.length}</strong></td>
              <td><span className="badge badge-yes">Bill Prepared</span></td>
            </tr>
            <tr>
              <td><strong>Bill Prepared But Paytment Not Rec</strong></td>
              <td><strong>{billPrepNotRecRows.length}</strong></td>
              <td><span className="badge badge-no">Bill Prepared But Paytment Not Rec</span></td>
            </tr>
            <tr>
              <td><strong>Total Amount</strong></td>
              <td><strong>₹{totalAmountSum.toLocaleString("en-US", { minimumFractionDigits: 2 })}</strong></td>
              <td>Summary Overview</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
