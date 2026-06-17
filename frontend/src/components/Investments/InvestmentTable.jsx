const STATUS_COLORS = {
  ACTIVE: "#10b981",
  COMPLETED: "#6366f1",
  CANCELLED: "#ef4444",
};

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n ?? 0);

const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function InvestmentTable({ investments, loading }) {
  if (loading) {
    return (
      <div className="card">
        <h2 className="card-title">My Investments</h2>
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton skeleton-row" />)}
      </div>
    );
  }

  if (!investments?.length) {
    return (
      <div className="card">
        <h2 className="card-title">My Investments</h2>
        <p className="empty-state">No investments yet. Create your first investment!</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="card-title">My Investments</h2>
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Plan</th>
              <th>Amount</th>
              <th>Daily ROI</th>
              <th>ROI Paid</th>
              <th>Start</th>
              <th>End</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((inv) => (
              <tr key={inv._id}>
                <td><span className="badge">{inv.plan}</span></td>
                <td>{fmt(inv.amount)}</td>
                <td>{inv.dailyROIPercent}%</td>
                <td>{fmt(inv.totalROIPaid)}</td>
                <td>{fmtDate(inv.startDate)}</td>
                <td>{fmtDate(inv.endDate)}</td>
                <td>
                  <span className="status-pill" style={{ "--c": STATUS_COLORS[inv.status] }}>
                    {inv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
