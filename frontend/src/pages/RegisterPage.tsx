import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { registerUser } from "../api/authApi";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
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

    if (form.password !== form.confirmPassword) {
      setError("Паролі не співпадають");
      return;
    }

    if (form.password.length < 6) {
      setError("Пароль має містити щонайменше 6 символів");
      return;
    }
    
    if (form.password.length > 64) {
      setError("Пароль має містити не більше 64 символів");
      return;
    }

    try {
      setSubmitting(true);

      const result = await registerUser({
        first_name: form.first_name,
        last_name: form.last_name,
        phone: form.phone,
        email: form.email,
        password: form.password,
      });

      login(result.access_token, result.user);
      navigate("/");
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const message =
            err.response?.data?.detail || "Не вдалося зареєструватися";
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
          <h1>Реєстрація</h1>

          <form className="auth-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="first_name"
              placeholder="Ім'я"
              value={form.first_name}
              onChange={handleChange}
            />

            <input
              type="text"
              name="last_name"
              placeholder="Прізвище"
              value={form.last_name}
              onChange={handleChange}
            />

            <input
              type="text"
              name="phone"
              placeholder="Телефон"
              value={form.phone}
              onChange={handleChange}
            />

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

            <input
              type="password"
              name="confirmPassword"
              placeholder="Підтвердження пароля"
              value={form.confirmPassword}
              onChange={handleChange}
            />

            {error && <div className="auth-error">{error}</div>}

            <button type="submit" className="auth-submit-btn" disabled={submitting}>
              {submitting ? "Реєстрація..." : "Зареєструватися"}
            </button>
          </form>

          <p className="auth-switch-text">
            Вже є акаунт? <Link to="/login">Увійти</Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
}