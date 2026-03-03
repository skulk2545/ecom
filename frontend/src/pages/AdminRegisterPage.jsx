import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client.js";

export default function AdminRegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/auth/register-admin", { name, email, password, code });
      navigate("/admin/login");
    } catch (err) {
      setError(err.response?.data?.detail || "Admin registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page center">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <h2>Create Admin Account</h2>
        {error && <p className="error">{error}</p>}
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={6}
            required
          />
        </label>
        <label>
          Admin code
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
          />
        </label>
        <button className="btn-primary full-width" disabled={loading}>
          {loading ? "Creating admin..." : "Register admin"}
        </button>
      </form>
    </main>
  );
}

