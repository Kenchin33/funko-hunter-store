import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { getMyOrderByNumber, type OrderRead } from "../api/orderApi";
import { useAuth } from "../hooks/useAuth";

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

function cleanOrderItemName(name: string) {
    // якщо пошкоджена коробка → залишаємо
    if (name.toLowerCase().includes("пошкоджена коробка")) {
      return name.replace(/\s*\(Стандартна коробка\)\s*/gi, "").trim();
    }
  
    // якщо стандартна → повністю прибираємо
    return name.replace(/\s*\(Стандартна коробка\)\s*/gi, "").trim();
  }

export default function OrderDetailsPage() {
  const { orderNumber } = useParams();
  const { token } = useAuth();

  const [order, setOrder] = useState<OrderRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      if (!token || !orderNumber) return;

      try {
        setLoading(true);
        setError("");
        const data = await getMyOrderByNumber(orderNumber, token);
        setOrder(data);
      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити замовлення");
      } finally {
        setLoading(false);
      }
    }

    loadOrder();
  }, [orderNumber, token]);

  return (
    <div className="store-page">
      <Header />

      <main className="profile-page">
        <section className="profile-orders-card">
          {loading ? (
            <div className="store-loading">Завантаження замовлення...</div>
          ) : error ? (
            <div className="search-empty-box">{error}</div>
          ) : !order ? (
            <div className="search-empty-box">Замовлення не знайдено.</div>
          ) : (
            <div className="order-details-card">
              <div className="order-details-top">
                <div>
                  <h1>Замовлення {order.order_number}</h1>
                  <div className="profile-order-date">
                    {new Date(order.created_at).toLocaleString("uk-UA")}
                  </div>
                </div>

                <div className="profile-order-meta">
                <span className={`profile-order-status status-${order.status}`}>
                  {formatStatus(order.status)}
                </span>
                  <strong>{order.total_amount} грн</strong>
                </div>
              </div>

              <div className="order-details-delivery">
                <h3>Адреса доставки</h3>
                <p className="order-details-delivery-text">
                    {order.delivery_city}, відділення {order.delivery_branch}
                </p>
              </div>
              
              {order.tracking_number && (
                <div className="order-details-delivery">
                  <h3>Трек-номер відправлення</h3>
                  <p className="order-details-delivery-text">
                    {order.tracking_number}
                  </p>
                </div>
              )}

              <div className="order-details-items">
                <h3>Товари у замовленні</h3>

                {order.items.map((item) => (
                  <div key={item.id} className="order-details-item">
                    <div className="order-details-item-left">
                      {item.image_url_snapshot ? (
                        <img
                          src={item.image_url_snapshot}
                          alt={item.product_name_snapshot}
                          className="order-details-item-image"
                        />
                      ) : (
                        <div className="order-details-item-image-placeholder">
                          No image
                        </div>
                      )}

                      <div>
                      <div className="order-details-item-title">
                        {cleanOrderItemName(item.product_name_snapshot)}
                      </div>
                      </div>
                    </div>

                    <div className="order-details-item-right">
                      <span>{item.quantity} шт.</span>
                      <strong>{item.price_snapshot} грн</strong>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-details-total">
                Разом: <strong>{order.total_amount} грн</strong>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}