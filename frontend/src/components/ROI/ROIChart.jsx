import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { useROIHistory } from "../../hooks/useDashboard";

const fmtDate = (d) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric" });

export default function ROIChart() {
  const { history, loading, error } = useROIHistory();

  if (loading) return <div className="card"><h2 className="card-title">ROI History</h2><div className="skeleton" style={{height:200}} /></div>;
  if (error) return <div className="card"><p className="form-error">{error}</p></div>;

  // Aggregate by date
  const byDate = {};
  history.forEach((r) => {
    const d = fmtDate(r.date);
    byDate[d] = (byDate[d] || 0) + r.amount;
  });
  const chartData = Object.entries(byDate)
    .map(([date, amount]) => ({ date, amount: parseFloat(amount.toFixed(2)) }))
    .reverse();

  return (
    <div className="card">
      <h2 className="card-title">Daily ROI (Last 30 Days)</h2>
      {chartData.length === 0 ? (
        <p className="empty-state">No ROI history yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="roiGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="date" tick={{ fontSize: 11, fill: "#94a3b8" }} />
            <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              formatter={(v) => [`$${v}`, "ROI"]}
              contentStyle={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 8 }}
              labelStyle={{ color: "#94a3b8" }}
            />
            <Area type="monotone" dataKey="amount" stroke="#6366f1" fill="url(#roiGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
