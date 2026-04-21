import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { loginUser } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname?: string } })?.from?.pathname || "/";
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      setSubmitting(true);
      const result = await loginUser(form);
      login(result.access_token, result.user);
      navigate(from, { replace: true });
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const message =
            err.response?.data?.detail || "Не вдалося увійти";
          setError(message);
        } else {
          setError("Невідома помилка");
        }
      } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="store-page">
      <Header />

      <main className="auth-page">
        <div className="auth-card">
          <h1>Вхід</h1>

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Пароль"
              value={form.password}
              onChange={handleChange}
            />

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-submit-btn" disabled={submitting}>
              {submitting ? "Вхід..." : "Увійти"}
            </button>
          </form>

          <p className="auth-switch-text">
            Немає акаунта? <Link to="/register">Зареєструватися</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}