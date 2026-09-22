import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../../context/AdminAuthContext";

export default function AdminLogin() {
  const { admin, login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (admin) return <Navigate to="/admin" replace />;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="admin-login-wrap">
      <div className="admin-login-card">
        <div className="brand" style={{ marginBottom: 28 }}>
          <img src="/images/brand/logo.png" alt="Bolatemi Global and Sons" className="logo-mark" />
          <div className="brand-name">Admin<span>Bolatemi Global and Sons</span></div>
        </div>
        <form onSubmit={submit}>
          {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}
          <div className="field">
            <label htmlFor="admin-email">Email</label>
            <input
              id="admin-email"
              name="email"
              required
              type="email"
              autoComplete="username"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sales@bolatemi.com"
            />
          </div>
          <div className="field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              name="password"
              required
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary btn-block" disabled={submitting}>{submitting ? "Signing in…" : "Sign In"}</button>
          <div style={{ marginTop: 16, textAlign: "center" }}>
            <a href="/" className="mono" style={{ fontSize: 11, color: "var(--ink-soft)" }}>
              ← Back to Store
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
