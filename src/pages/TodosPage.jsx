
import { useEffect, useState } from "react";
import {
  addItem,
  deleteItem,
  getItems,
  saveItems,
  updateItem,
} from "../services/dataService";
import ErrorMessage from "../components/ErrorMessage";

const EMPTY_FORM = {
  title: "",
  description: "",
  priority: "Medium",
};

export default function TodosPage() {
  const [todos, setTodos] = useState(() => getItems("todos"));
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [error, setError] = useState("");

  // Update the UI and browser storage together.
  function refreshTodos(nextTodos) {
    saveItems("todos", nextTodos);
    setTodos(nextTodos);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Task title is required.");
      return;
    }

    if (editingId) {
      const updated = updateItem("todos", editingId, {
        ...form,
        title: form.title.trim(),
      });

      setTodos(updated);
    } else {
      const newTodo = addItem("todos", {
        ...form,
        title: form.title.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
      });

      setTodos((current) => [...current, newTodo]);
    }

    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function startEditing(todo) {
    setEditingId(todo.id);
    setForm({
      title: todo.title,
      description: todo.description || "",
      priority: todo.priority || "Medium",
    });

    setError("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditing() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
  }

  function toggleCompleted(todo) {
    const updated = updateItem("todos", todo.id, {
      completed: !todo.completed,
    });

    setTodos(updated);
  }

  function removeTodo(id) {
    const remaining = deleteItem("todos", id);
    setTodos(remaining);

    if (editingId === id) {
      cancelEditing();
    }
  }

  // Search titles/descriptions and apply the selected status filter.
  const filteredTodos = todos.filter((todo) => {
    const query = search.toLowerCase();

    const matchesSearch =
      todo.title.toLowerCase().includes(query) ||
      (todo.description || "").toLowerCase().includes(query);

    const matchesFilter =
      filter === "all" ||
      (filter === "completed" && todo.completed) ||
      (filter === "pending" && !todo.completed);

    return matchesSearch && matchesFilter;
  });

  const completedCount = todos.filter((todo) => todo.completed).length;

  return (
    <div>
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR WORK</p>
          <h1>My Tasks</h1>
          <p className="muted">
            Organize your day and track your progress.
          </p>
        </div>
        <div className="task-progress">
          <strong>{completedCount}/{todos.length}</strong>
          <span className="muted small-text">tasks completed</span>
        </div>
      </div>

      <div className="todo-layout">
        <section className="panel todo-form-panel">
          <h2>{editingId ? "Edit task" : "Create a task"}</h2>
          <p className="muted">
            {editingId ? "Update the details below." : "Add something you want to accomplish."}
          </p>

          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit} className="form-stack">
            <label>
              Task title
              <input
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                placeholder="e.g. Finish React assignment"
                required
              />
            </label>

            <label>
              Description
              <textarea
                rows="4"
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
                placeholder="Add more details (optional)"
              />
            </label>

            <label>
              Priority
              <select
                value={form.priority}
                onChange={(event) =>
                  setForm({ ...form, priority: event.target.value })
                }
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>
            </label>

            <button className="button button-primary full-width" type="submit">
              {editingId ? "Save changes" : "+ Create task"}
            </button>

            {editingId && (
              <button
                className="button button-secondary full-width"
                type="button"
                onClick={cancelEditing}
              >
                Cancel editing
              </button>
            )}
          </form>
        </section>

        <section className="panel todo-list-panel">
          <div className="panel-heading">
            <div>
              <h2>All tasks</h2>
              <p className="muted">{filteredTodos.length} tasks found</p>
            </div>
          </div>

          <div className="todo-toolbar">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search tasks..."
              aria-label="Search tasks"
            />

            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              aria-label="Filter tasks"
            >
              <option value="all">All tasks</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {filteredTodos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <h3>No tasks found</h3>
              <p>Try another search or create a new task.</p>
            </div>
          ) : (
            <div className="todo-list">
              {filteredTodos.map((todo) => (
                <article
                  key={todo.id}
                  className={`todo-item ${todo.completed ? "todo-done" : ""}`}
                >
                  <input
                    className="todo-checkbox"
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleCompleted(todo)}
                    aria-label={`Mark ${todo.title} completed`}
                  />

                  <div className="todo-details">
                    <h3>{todo.title}</h3>
                    {todo.description && <p>{todo.description}</p>}

                    <div className="todo-meta">
                      <span
                        className={`priority priority-${(
                          todo.priority || "medium"
                        ).toLowerCase()}`}
                      >
                        {todo.priority || "Medium"} priority
                      </span>

                      <span className="muted small-text">
                        {todo.completed ? "Completed" : "In progress"}
                      </span>
                    </div>
                  </div>

                  <div className="todo-actions">
                    <button
                      className="icon-button"
                      onClick={() => startEditing(todo)}
                      aria-label={`Edit ${todo.title}`}
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button
                      className="icon-button danger"
                      onClick={() => removeTodo(todo.id)}
                      aria-label={`Delete ${todo.title}`}
                      title="Delete"
                    >
                      ×
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}