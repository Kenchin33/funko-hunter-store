import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { getMyOrders, type OrderRead } from "../api/orderApi";
import { useAuth } from "../hooks/useAuth";

function formatStatus(status: string) {
  switch (status) {
    case "new":
      return "Нове";
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

export default function OrdersPage() {
  const { token } = useAuth();
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

  return (
    <div className="store-page">
      <Header />

      <main className="profile-page">
        <section className="profile-orders-card">
          <div className="profile-orders-header">
            <h1>Усі замовлення</h1>
          </div>

          {loading ? (
            <div className="store-loading">Завантаження замовлень...</div>
          ) : error ? (
            <div className="search-empty-box">{error}</div>
          ) : orders.length === 0 ? (
            <div className="search-empty-box">У вас ще немає замовлень.</div>
          ) : (
            <div className="profile-orders-list">
              {orders.map((order) => (
                <div key={order.id} className="profile-order-item">
                  <div className="profile-order-top">
                    <div>
                      <Link
                        to={`/orders/${order.order_number}`}
                        className="profile-order-number-link"
                      >
                        Замовлення {order.order_number}
                      </Link>

                      <div className="profile-order-date">
                        {new Date(order.created_at).toLocaleString("uk-UA")}
                      </div>
                    </div>

                    <div className="profile-order-meta">
                      <span className="profile-order-status">
                        {formatStatus(order.status)}
                      </span>
                      <strong>{order.total_amount} грн</strong>
                    </div>
                  </div>

                  <div className="profile-order-delivery">
                    Доставка: {order.delivery_city}, відділення {order.delivery_branch}
                  </div>

                  <div className="profile-order-products">
                    {order.items.slice(0, 3).map((item) => (
                      <div key={item.id} className="profile-order-product">
                        <span>{item.product_name_snapshot}</span>
                        <span>
                          {item.quantity} × {item.price_snapshot} грн
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}