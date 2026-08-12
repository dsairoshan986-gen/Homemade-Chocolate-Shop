import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const location = useLocation();

  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  // User is not logged in
  if (!user || !token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          message: "Please login or register first."
        }}
      />
    );
  }

  // User is logged in
  return children;
};

export default ProtectedRoute;