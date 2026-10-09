
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    setSidebarOpen(false);
    logout();
    navigate("/login");
  };

  const links = [
    { path: "/", label: "Dashboard" },
    { path: "/todos", label: "Todos" },
    { path: "/users", label: "Users" },
    { path: "/products", label: "Products" },
    { path: "/orders", label: "Orders" },
    { path: "/notifications", label: "Notifications" },
  ];

  return (
    <div className="app-layout">
      <header className="mobile-menu-bar">
        <button
          className="mobile-menu-toggle"
          type="button"
          aria-label={sidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={sidebarOpen}
          aria-controls="app-sidebar"
          onClick={() => setSidebarOpen((open) => !open)}
        >
          {sidebarOpen ? "\u00d7" : "\u2630"}
        </button>
        <span>Todo App</span>
      </header>

      {sidebarOpen && (
        <button
          className="sidebar-backdrop"
          type="button"
          aria-label="Close navigation menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`sidebar${sidebarOpen ? " is-open" : ""}`}
        id="app-sidebar"
      >
        <h2>Todo App</h2>

        <nav className="sidebar-nav">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              end={link.path === "/"}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>{user?.name || user?.email || "User"}</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
