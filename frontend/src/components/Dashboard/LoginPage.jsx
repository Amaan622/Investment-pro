import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "", referralCode: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") await login(form.email, form.password);
      else await register(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-icon lg">💎</span>
          <h1>InvestPro</h1>
          <p>Your intelligent investment platform</p>
        </div>

        <div className="auth-tabs">
          <button className={mode === "login" ? "auth-tab-active" : "auth-tab"} onClick={() => setMode("login")}>Login</button>
          <button className={mode === "register" ? "auth-tab-active" : "auth-tab"} onClick={() => setMode("register")}>Register</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "register" && (
            <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="form-input" required />
          )}
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="form-input" required />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} className="form-input" required />
          {mode === "register" && (
            <input name="referralCode" placeholder="Referral Code (optional)" value={form.referralCode} onChange={handleChange} className="form-input" />
          )}
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
}
