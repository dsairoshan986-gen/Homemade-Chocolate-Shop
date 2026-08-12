import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const userData = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  // Not logged in
  if (!userData || !token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(userData);

    // Check different possible role field names
    const role = String(
      user.role ||
      user.accountType ||
      user.userType ||
      user.type ||
      ""
    ).toLowerCase().trim();

    // Allow only admin
    if (role !== "admin" && role !== "administrator") {
      return <Navigate to="/" replace />;
    }

    // Admin is authenticated
    return children;
  } catch (error) {
    console.error("Admin authentication error:", error);

    // Clear invalid authentication data
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");

    return <Navigate to="/login" replace />;
  }
};

export default AdminRoute;