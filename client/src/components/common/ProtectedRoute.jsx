import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = ({ children, role, redirectTo = "/login" }) => {
  const { isLoggedIn, user } = useAuth();

  if (!isLoggedIn) return <Navigate to={redirectTo} replace />;
  if (role && user?.role !== role) return <Navigate to="/" replace />; // or a forbidden page

  return children;
};


export default ProtectedRoute;
