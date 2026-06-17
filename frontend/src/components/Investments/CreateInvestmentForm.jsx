import { useState } from "react";
import { investmentsAPI } from "../../services/api";

const PLANS = [
  { key: "STARTER", label: "Starter", min: 100, max: 999, roi: "0.5%", days: 30 },
  { key: "GROWTH",  label: "Growth",  min: 1000, max: 4999, roi: "0.75%", days: 60 },
  { key: "PRO",     label: "Pro",     min: 5000, max: 19999, roi: "1.0%", days: 90 },
  { key: "ELITE",   label: "Elite",   min: 20000, max: null, roi: "1.25%", days: 180 },
];

export default function CreateInvestmentForm({ onSuccess }) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const matchedPlan = PLANS.find(
    (p) => Number(amount) >= p.min && (p.max === null || Number(amount) <= p.max)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      await investmentsAPI.create({ amount: Number(amount) });
      setSuccess("Investment created successfully!");
      setAmount("");
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="card-title">New Investment</h2>
      <form onSubmit={handleSubmit} className="invest-form">
        <div className="form-group">
          <label>Amount (USD)</label>
          <input
            type="number"
            min="100"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount..."
            className="form-input"
            required
          />
        </div>

        {matchedPlan && (
          <div className="plan-preview">
            <strong>{matchedPlan.label} Plan</strong>
            <span>{matchedPlan.roi} daily</span>
            <span>{matchedPlan.days} days</span>
            <span>Est. total: ${((Number(amount) * parseFloat(matchedPlan.roi) * matchedPlan.days) / 100).toFixed(2)}</span>
          </div>
        )}

        {!matchedPlan && amount && (
          <p className="plan-hint">
            Plans: $100–$999 (Starter) · $1K–$4.9K (Growth) · $5K–$19.9K (Pro) · $20K+ (Elite)
          </p>
        )}

        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}

        <button type="submit" className="btn-primary" disabled={loading || !matchedPlan}>
          {loading ? "Processing..." : "Invest Now"}
        </button>
      </form>

      <div className="plans-grid">
        {PLANS.map((p) => (
          <div
            key={p.key}
            className={`plan-card ${matchedPlan?.key === p.key ? "plan-active" : ""}`}
            onClick={() => setAmount(String(p.min))}
          >
            <h4>{p.label}</h4>
            <p className="plan-roi">{p.roi}<span>/day</span></p>
            <p className="plan-range">${p.min.toLocaleString()} – {p.max ? `$${p.max.toLocaleString()}` : "∞"}</p>
            <p className="plan-days">{p.days} days</p>
          </div>
        ))}
      </div>
    </div>
  );
}
