import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export function LoginPage() {
  const { login } = useAuth();
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
      await login(email, password);
      navigate("/products");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      {/* Visual side */}
      <div className="auth-visual">
        <h2>Welcome Back!</h2>
        <p>Sign in to explore authentic Maharashtrian Khakhra & Spices from HD Foods and Masale.</p>
      </div>

      {/* Form side */}
      <div className="auth-form-side">
        <div className="auth-card">
          <h2>Sign In</h2>
          <span className="auth-subtitle">Good to see you again! Enter your credentials.</span>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <label>
              Email Address
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </label>

            <button
              type="submit"
              className="btn-primary full-width"
              disabled={loading}
              style={{ padding: ".75rem", fontSize: ".95rem", borderRadius: "var(--r-sm)", marginTop: ".25rem" }}
            >
              {loading ? "Signing in…" : "Sign In →"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: ".83rem", color: "var(--text-muted)" }}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--green-dark)", fontWeight: 700 }}>Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      navigate("/products");
    } catch {
      setError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      {/* Visual side */}
      <div className="auth-visual">
        <h2>Join HD Foods and Masale</h2>
        <p>Get access to authentic Maharashtrian Khakhra & Spices. Free shipping on your first order!</p>
      </div>

      {/* Form side */}
      <div className="auth-form-side">
        <div className="auth-card">
          <h2>Create Account</h2>
          <span className="auth-subtitle">It's free! Get started in seconds.</span>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit}>
            <label>
              Full Name
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
            </label>
            <label>
              Email Address
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </label>
            <label>
              Password
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min. 6 characters" minLength={6} required />
            </label>

            <button
              type="submit"
              className="btn-primary full-width"
              disabled={loading}
              style={{ padding: ".75rem", fontSize: ".95rem", borderRadius: "var(--r-sm)", marginTop: ".25rem" }}
            >
              {loading ? "Creating account…" : "Create Account →"}
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: ".83rem", color: "var(--text-muted)" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--green-dark)", fontWeight: 700 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
