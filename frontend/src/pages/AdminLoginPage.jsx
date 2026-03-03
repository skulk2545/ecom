import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export default function AdminLoginPage() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const me = await login(email, password);
      if (me.role !== "admin") {
        logout();
        setError("This account does not have administrator access.");
        return;
      }
      navigate("/admin");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      {/* Visual side */}
      <div className="auth-visual">
        <div className="auth-visual-emoji">🔐</div>
        <h2>Admin Portal</h2>
        <p>Secure access for HOMEDOKAN administrators. Manage products, orders, and more.</p>
      </div>

      {/* Form side */}
      <div className="auth-form-side">
        <div className="auth-card">
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", background: "#f0fdf4", border: "1px solid #bbf7d0", color: "#15803d", fontSize: ".75rem", fontWeight: 700, padding: ".3rem .85rem", borderRadius: 999, marginBottom: "1.25rem" }}>
            🛡️ Administrator Access Only
          </div>

          <h2>Sign In to Admin</h2>
          <span className="auth-subtitle">Your session is secure and monitored.</span>

          {error && <p className="error">⚠️ {error}</p>}

          <form onSubmit={handleSubmit}>
            <label>
              Admin Email
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@example.com" required />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </label>
            <button type="submit" className="btn-primary full-width" disabled={loading}
              style={{ padding: ".75rem", fontSize: ".95rem", borderRadius: 10, marginTop: ".25rem", background: "#15803d" }}>
              {loading ? "Authenticating…" : "Access Dashboard →"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: ".83rem", color: "#9ca3af" }}>
            Need an admin account?{" "}
            <Link to="/admin/register" style={{ color: "#15803d", fontWeight: 700 }}>Register here</Link>
          </p>
          <p style={{ textAlign: "center", marginTop: ".75rem", fontSize: ".8rem" }}>
            <Link to="/" style={{ color: "#9ca3af" }}>← Back to Store</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
