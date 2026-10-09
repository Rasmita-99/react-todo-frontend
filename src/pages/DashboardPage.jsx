
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getItems } from "../services/dataService";

export default function DashboardPage() {
  const { user } = useAuth();
  const todos = getItems("todos");
  const products = getItems("products");
  const orders = getItems("orders");
  const notifications = getItems("notifications");

  const completed = todos.filter((todo) => todo.completed).length;
  const pending = todos.length - completed;
  const unread = notifications.filter((item) => !item.read).length;

  const stats = [
    { label: "Total tasks", value: todos.length, symbol: "▦" },
    { label: "Completed", value: completed, symbol: "✓" },
    { label: "Pending tasks", value: pending, symbol: "◷" },
    { label: "Products", value: products.length, symbol: "□" },
  ];

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Good to see you, {user?.name}!</h1>
          <p className="muted">
            Here is what's happening in your workspace today.
          </p>
        </div>

        <Link to="/todos" className="button button-primary">
          + Add a task
        </Link>
      </div>

      <section className="stats-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <div className="stat-top">
              <span>{stat.label}</span>
              <span className="stat-symbol">{stat.symbol}</span>
            </div>
            <h2>{stat.value}</h2>
            <span className="muted small-text">Saved in this browser</span>
          </article>
        ))}
      </section>

      <div className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <h2>Recent tasks</h2>
              <p className="muted">Your latest work items</p>
            </div>
            <Link to="/todos">View all</Link>
          </div>

          {todos.length === 0 ? (
            <p className="empty-state">No tasks yet. Create your first task.</p>
          ) : (
            <div className="recent-list">
              {todos.slice(-5).reverse().map((todo) => (
                <div className="recent-item" key={todo.id}>
                  <span className={`status-dot ${todo.completed ? "done" : ""}`} />
                  <div className="recent-text">
                    <strong className={todo.completed ? "completed-text" : ""}>
                      {todo.title}
                    </strong>
                    <span>{todo.priority || "Medium"} priority</span>
                  </div>
                  <span className={`status-pill ${todo.completed ? "success" : "pending"}`}>
                    {todo.completed ? "Completed" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="panel">
          <h2>Workspace summary</h2>
          <p className="muted">Quick access to your modules.</p>

          <div className="quick-links">
            <Link to="/users" className="quick-link">
              <span className="quick-icon">♙</span>
              <span><strong>Users</strong><small>Manage user records</small></span>
              <span>→</span>
            </Link>

            <Link to="/products" className="quick-link">
              <span className="quick-icon">□</span>
              <span><strong>Products</strong><small>{products.length} products</small></span>
              <span>→</span>
            </Link>

            <Link to="/orders" className="quick-link">
              <span className="quick-icon">▤</span>
              <span><strong>Orders</strong><small>{orders.length} orders</small></span>
              <span>→</span>
            </Link>

            <Link to="/notifications" className="quick-link">
              <span className="quick-icon">♧</span>
              <span><strong>Notifications</strong><small>{unread} unread</small></span>
              <span>→</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}