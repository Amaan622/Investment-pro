import StatCard from "./StatCard";

const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n ?? 0);

export default function SummaryStats({ summary, loading }) {
  const cards = [
    {
      label: "Wallet Balance",
      value: fmt(summary?.walletBalance),
      sub: "Available to withdraw",
      icon: "💰",
      color: "#10b981",
    },
    {
      label: "Total Invested",
      value: fmt(summary?.totalInvested),
      sub: `${summary?.activeInvestments ?? 0} active plan(s)`,
      icon: "📈",
      color: "#6366f1",
    },
    {
      label: "Total ROI Earned",
      value: fmt(summary?.totalROIEarned),
      sub: `Today: ${fmt(summary?.todayROI)}`,
      icon: "🎯",
      color: "#f59e0b",
    },
    {
      label: "Level Income",
      value: fmt(summary?.totalLevelIncome),
      sub: `Today: ${fmt(summary?.todayLevelIncome)}`,
      icon: "🔗",
      color: "#ec4899",
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((c) => (
        <StatCard key={c.label} {...c} loading={loading} />
      ))}
    </div>
  );
}
