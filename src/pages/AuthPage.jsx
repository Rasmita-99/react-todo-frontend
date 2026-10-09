
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";

export default function AuthPage({ mode }) {
  const isRegister = mode === "register";
  const { login, register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // If already logged in, don't show the auth form.
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    if (isRegister && !name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (isRegister && password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      if (isRegister) {
        register(name, email, password);
      } else {
        login(email, password);
      }

      navigate("/");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand-mark">T</div>
        <h1>{isRegister ? "Create your account" : "Welcome back"}</h1>
        <p className="muted">
          {isRegister
            ? "Start organizing your work."
            : "Sign in to continue to your workspace."}
        </p>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} className="form-stack">
          {isRegister && (
            <label>
              Full name
              <input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
                autoComplete="name"
                required
              />
            </label>
          )}

          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="At least 6 characters"
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
            />
          </label>

          <button className="button button-primary full-width" type="submit">
            {isRegister ? "Create account" : "Sign in"}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? "Already have an account?" : "New here?"}{" "}
          <Link to={isRegister ? "/login" : "/register"}>
            {isRegister ? "Sign in" : "Create an account"}
          </Link>
        </p>

        <p className="demo-note">
          Demo only: create an account here, then use it to sign in.
        </p>
      </section>
    </main>
  );
}