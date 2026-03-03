import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}

export function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return <div className="center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}

