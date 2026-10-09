
import { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  addItem,
  deleteItem,
  getItems,
  saveItems,
  updateItem,
} from "../services/dataService";
import ErrorMessage from "../components/ErrorMessage";

// Each module defines its own fields and sample data.
const MODULES = {
  "/users": {
    key: "users",
    title: "Users",
    description: "Manage workspace user records.",
    fields: [
      { name: "name", label: "Full name", required: true },
      { name: "email", label: "Email", type: "email", required: true },
      {
        name: "role",
        label: "Role",
        type: "select",
        options: ["user", "admin"],
      },
    ],
    initial: { name: "", email: "", role: "user" },
    columns: [
      { key: "name", label: "Name" },
      { key: "email", label: "Email" },
      { key: "role", label: "Role" },
    ],
  },

  "/products": {
    key: "products",
    title: "Products",
    description: "Track your products, prices, and stock.",
    fields: [
      { name: "name", label: "Product name", required: true },
      { name: "price", label: "Price", type: "number", required: true },
      { name: "stock", label: "Stock quantity", type: "number", required: true },
    ],
    initial: { name: "", price: "", stock: "" },
    columns: [
      { key: "name", label: "Product" },
      { key: "price", label: "Price" },
      { key: "stock", label: "Stock" },
    ],
  },

  "/orders": {
    key: "orders",
    title: "Orders",
    description: "Create and review customer orders.",
    fields: [
      { name: "customer", label: "Customer name", required: true },
      { name: "product", label: "Product", required: true },
      { name: "quantity", label: "Quantity", type: "number", required: true },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["Pending", "Processing", "Completed", "Cancelled"],
      },
    ],
    initial: {
      customer: "",
      product: "",
      quantity: "1",
      status: "Pending",
    },
    columns: [
      { key: "customer", label: "Customer" },
      { key: "product", label: "Product" },
      { key: "quantity", label: "Quantity" },
      { key: "status", label: "Status" },
    ],
  },

  "/notifications": {
    key: "notifications",
    title: "Notifications",
    description: "View messages and manage read status.",
    fields: [
      { name: "message", label: "Notification message", required: true },
    ],
    initial: { message: "" },
    columns: [
      { key: "message", label: "Message" },
      { key: "read", label: "Status" },
    ],
  },
};

export default function ResourcePages() {
  const location = useLocation();
  const config = MODULES[location.pathname];

  const [items, setItems] = useState(() => getItems(config.key));
  const [form, setForm] = useState(config.initial);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // Persist a change and update the visible list.
  function refresh(nextItems) {
    saveItems(config.key, nextItems);
    setItems(nextItems);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    for (const field of config.fields) {
      if (field.required && !String(form[field.name] ?? "").trim()) {
        setError(`${field.label} is required.`);
        return;
      }
    }

    // Convert number inputs to numbers before saving.
    const values = { ...form };

    config.fields.forEach((field) => {
      if (field.type === "number") {
        values[field.name] = Number(values[field.name]);
      }
    });

    if (config.key === "notifications") {
      values.read = false;
      values.createdAt = new Date().toISOString();
    }

    if (editingId) {
      const updated = updateItem(config.key, editingId, values);
      setItems(updated);
    } else {
      const created = addItem(config.key, values);
      setItems((current) => [...current, created]);
    }

    setForm(config.initial);
    setEditingId(null);
  }

  function editItem(item) {
    setEditingId(item.id);

    // Only put editable fields into the form.
    const editableValues = {};
    config.fields.forEach((field) => {
      editableValues[field.name] = item[field.name] ?? "";
    });

    setForm(editableValues);
    setError("");
  }

  function removeItem(id) {
    refresh(items.filter((item) => item.id !== id));

    if (editingId === id) {
      setEditingId(null);
      setForm(config.initial);
    }
  }

  function toggleRead(item) {
    const updated = updateItem(config.key, item.id, {
      read: !item.read,
    });

    setItems(updated);
  }

  const filteredItems = items.filter((item) =>
    config.columns.some((column) =>
      String(item[column.key] ?? "")
        .toLowerCase()
        .includes(search.toLowerCase())
    )
  );

  if (!config) {
    return <div className="panel">Module not found.</div>;
  }

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">WORKSPACE MODULE</p>
          <h1>{config.title}</h1>
          <p className="muted">{config.description}</p>
        </div>
      </div>

      <div className="resource-layout">
        <section className="panel">
          <h2>{editingId ? "Edit record" : `Add ${config.title.toLowerCase().slice(0, -1)}`}</h2>

          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit} className="form-stack">
            {config.fields.map((field) => (
              <label key={field.name}>
                {field.label}

                {field.type === "select" ? (
                  <select
                    value={form[field.name]}
                    onChange={(event) =>
                      setForm({ ...form, [field.name]: event.target.value })
                    }
                    required={field.required}
                  >
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.type || "text"}
                    min={field.type === "number" ? "0" : undefined}
                    step={field.name === "price" ? "0.01" : "1"}
                    value={form[field.name]}
                    onChange={(event) =>
                      setForm({ ...form, [field.name]: event.target.value })
                    }
                    required={field.required}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}
              </label>
            ))}

            <button type="submit" className="button button-primary full-width">
              {editingId ? "Save changes" : "Add record"}
            </button>

            {editingId && (
              <button
                type="button"
                className="button button-secondary full-width"
                onClick={() => {
                  setEditingId(null);
                  setForm(config.initial);
                  setError("");
                }}
              >
                Cancel
              </button>
            )}
          </form>
        </section>

        <section className="panel resource-table-panel">
          <div className="panel-heading">
            <div>
              <h2>All {config.title.toLowerCase()}</h2>
              <p className="muted">{filteredItems.length} records</p>
            </div>
          </div>

          <input
            className="resource-search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={`Search ${config.title.toLowerCase()}...`}
            aria-label={`Search ${config.title}`}
          />

          {filteredItems.length === 0 ? (
            <div className="empty-state">No records found.</div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    {config.columns.map((column) => (
                      <th key={column.key}>{column.label}</th>
                    ))}
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item.id}>
                      {config.columns.map((column) => (
                        <td key={column.key}>
                          {column.key === "read" ? (
                            <span className={`status-pill ${item.read ? "success" : "pending"}`}>
                              {item.read ? "Read" : "Unread"}
                            </span>
                          ) : (
                            String(item[column.key] ?? "—")
                          )}
                        </td>
                      ))}

                      <td>
                        <div className="table-actions">
                          {config.key === "notifications" && (
                            <button
                              className="text-button"
                              onClick={() => toggleRead(item)}
                            >
                              {item.read ? "Mark unread" : "Mark read"}
                            </button>
                          )}

                          <button
                            className="text-button"
                            onClick={() => editItem(item)}
                          >
                            Edit
                          </button>

                          <button
                            className="text-button danger-text"
                            onClick={() => removeItem(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}