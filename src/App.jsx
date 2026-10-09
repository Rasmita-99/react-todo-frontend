
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
// import AppLayout from "./components/AppLayout";
import AppLayout from "./components/AppLayout"

import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import TodosPage from "./pages/TodosPage";
import ResourcePages from "./pages/ResourcePages";
import { initializeData } from "./services/dataService";

// Prepare example data when the application loads.
initializeData();

export default function App() {
  return (
    <Routes>
      {/* Public authentication pages */}
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/register" element={<AuthPage mode="register" />} />

      {/* Everything inside this route requires authentication. */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/todos" element={<TodosPage />} />
          <Route path="/users" element={<ResourcePages />} />
          <Route path="/products" element={<ResourcePages />} />
          <Route path="/orders" element={<ResourcePages />} />
          <Route path="/notifications" element={<ResourcePages />} />
        </Route>
      </Route>

      {/* Unknown paths redirect to the dashboard. */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}