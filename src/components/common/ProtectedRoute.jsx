/* ===================================================
   ONLINE LIBRARY MANAGEMENT SYSTEM
   Protected Route Component (ProtectedRoute.jsx)
=================================================== */

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ allowedRole, children }) {
  const { userRole, loading } = useAuth();

  if (loading) {
    return null; // Or a subtle loader if needed
  }

  // Check localStorage directly as fallback to prevent race condition on page refresh
  const currentRole = userRole || localStorage.getItem("userRole");

  if (!currentRole) {
    return <Navigate to="/" replace />;
  }

  if (allowedRole && currentRole !== allowedRole) {
    // If logged in as opposite role, redirect to appropriate portal
    if (currentRole === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (currentRole === "user") {
      return <Navigate to="/student" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
