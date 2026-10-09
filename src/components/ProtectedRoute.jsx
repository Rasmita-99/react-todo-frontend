import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();

  // Send unauthenticated visitors to the login page.
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render the matched private route.
  return <Outlet />;
}