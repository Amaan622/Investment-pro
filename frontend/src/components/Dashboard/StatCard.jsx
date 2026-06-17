export default function StatCard({ label, value, sub, icon, color = "#6366f1", loading }) {
  return (
    <div className="stat-card" style={{ "--accent": color }}>
      <div className="stat-icon">{icon}</div>
      <div className="stat-body">
        <p className="stat-label">{label}</p>
        {loading ? (
          <div className="skeleton skeleton-value" />
        ) : (
          <h3 className="stat-value">{value}</h3>
        )}
        {sub && <p className="stat-sub">{sub}</p>}
      </div>
    </div>
  );
}
