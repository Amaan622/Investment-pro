import { useState } from "react";
import { AuthProvider, useAuth } from "./hooks/useAuth";
import { useDashboard } from "./hooks/useDashboard";
import LoginPage from "./components/Dashboard/LoginPage";
import Navbar from "./components/Dashboard/Navbar";
import SummaryStats from "./components/Dashboard/SummaryStats";
import InvestmentTable from "./components/Investments/InvestmentTable";
import CreateInvestmentForm from "./components/Investments/CreateInvestmentForm";
import ROIChart from "./components/ROI/ROIChart";
import ReferralTree from "./components/Referral/ReferralTree";
import "./index.css";

function DashboardApp() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const { data, loading, error, refetch } = useDashboard();

  if (!user) return <LoginPage />;

  return (
    <div className="app">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="main-content">
        {error && <div className="alert-error">⚠️ {error}</div>}

        {activeTab === "overview" && (
          <>
            <SummaryStats summary={data?.summary} loading={loading} />
            <div className="two-col">
              <ROIChart />
              <CreateInvestmentForm onSuccess={refetch} />
            </div>
            <InvestmentTable investments={data?.investments} loading={loading} />
          </>
        )}

        {activeTab === "investments" && (
          <>
            <CreateInvestmentForm onSuccess={refetch} />
            <InvestmentTable investments={data?.investments} loading={loading} />
          </>
        )}

        {activeTab === "roi" && <ROIChart />}

        {activeTab === "referrals" && (
          <>
            {user?.referralCode && (
              <div className="card referral-code-card">
                <h2 className="card-title">Your Referral Code</h2>
                <div className="ref-code-box">
                  <span className="ref-code">{user.referralCode}</span>
                  <button className="btn-ghost" onClick={() => navigator.clipboard.writeText(user.referralCode)}>
                    Copy
                  </button>
                </div>
                <p className="ref-hint">Earn up to 5% commission on 5 levels of referrals</p>
              </div>
            )}
            <ReferralTree />
          </>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DashboardApp />
    </AuthProvider>
  );
}
