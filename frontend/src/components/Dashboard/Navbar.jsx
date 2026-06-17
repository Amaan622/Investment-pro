import { useAuth } from "../../hooks/useAuth";

export default function Navbar({ activeTab, setActiveTab }) {
  const { user, logout } = useAuth();

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "investments", label: "Investments" },
    { id: "roi", label: "ROI History" },
    { id: "referrals", label: "Network" },
  ];

  return (
    <header className="navbar">
      <div className="navbar-brand">
        <span className="brand-icon">💎</span>
        <span className="brand-name">InvestPro</span>
      </div>
      <nav className="navbar-tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`nav-tab ${activeTab === t.id ? "nav-tab-active" : ""}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>
      <div className="navbar-user">
        <span className="user-name">{user?.name}</span>
        <button className="btn-ghost" onClick={logout}>Logout</button>
      </div>
    </header>
  );
}
