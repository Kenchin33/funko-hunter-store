import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useAuth } from "../hooks/useAuth";
import { getMyOrders, type OrderRead } from "../api/orderApi";

function formatStatus(status: string) {
  switch (status) {
    case "new":
      return "Нове";
    case "shipped":
      return "Відправлено";
    case "in_progress":
      return "В обробці";
    case "resolved":
      return "Завершене";
    case "rejected":
      return "Скасоване";
    default:
      return status;
  }
}

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState<OrderRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrders() {
      if (!token) return;

      try {
        setLoading(true);
        setError("");
        const data = await getMyOrders(token);
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити замовлення");
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [token]);

  const latestOrder = orders[0] ?? null;

  return (
    <div className="store-page">
      <Header />

      <main className="profile-page">
        <section className="profile-card">
          <h1>Мій профіль</h1>

          <div className="profile-info-grid">
            <div className="profile-info-item">
              <span>Ім'я</span>
              <strong>{user?.first_name}</strong>
            </div>
            <div className="profile-info-item">
              <span>Прізвище</span>
              <strong>{user?.last_name}</strong>
            </div>
            <div className="profile-info-item">
              <span>Email</span>
              <strong>{user?.email}</strong>
            </div>
            <div className="profile-info-item">
              <span>Телефон</span>
              <strong>{user?.phone || "—"}</strong>
            </div>
          </div>
        </section>

        <section className="profile-orders-card">
          <div className="profile-orders-header">
            <h2>Мої замовлення</h2>

            <Link to="/orders" className="profile-view-all-btn">
              Переглянути усі замовлення
            </Link>
          </div>

          {loading ? (
            <div className="store-loading">Завантаження замовлень...</div>
          ) : error ? (
            <div className="search-empty-box">{error}</div>
          ) : !latestOrder ? (
            <div className="search-empty-box">У вас ще немає замовлень.</div>
          ) : (
            <div className="profile-latest-order-card">
              <div className="profile-order-top">
                <div>
                  <Link
                    to={`/orders/${latestOrder.order_number}`}
                    className="profile-order-number-link"
                  >
                    Замовлення {latestOrder.order_number}
                  </Link>

                  <div className="profile-order-date">
                    {new Date(latestOrder.created_at).toLocaleString("uk-UA")}
                  </div>
                </div>

                <div className="profile-order-meta">
                <span className={`profile-order-status status-${latestOrder.status}`}>
                  {formatStatus(latestOrder.status)}
                </span>
                  <strong>{latestOrder.total_amount} грн</strong>
                </div>
              </div>

              <div className="profile-order-delivery">
                Доставка: {latestOrder.delivery_city}, відділення {latestOrder.delivery_branch}
              </div>

              <div className="profile-order-images">
                {latestOrder.items.slice(0, 3).map((item) =>
                  item.image_url_snapshot ? (
                    <img
                      key={item.id}
                      src={item.image_url_snapshot}
                      alt={item.product_name_snapshot}
                      className="profile-order-preview-image"
                    />
                  ) : (
                    <div
                      key={item.id}
                      className="profile-order-preview-image profile-order-preview-placeholder"
                    >
                      No image
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}