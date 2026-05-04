import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { trackOrder, type OrderRead } from "../api/orderApi";

function formatStatus(status: string) {
  switch (status) {
    case "new":
      return "Нове";
    case "shipped":
      return "Відправлено";
    case "resolved":
      return "Завершене";
    case "rejected":
      return "Скасоване";
    default:
      return status;
  }
}

function cleanOrderItemName(name: string) {
  return name.replace(/\s*\(Стандартна коробка\)\s*/gi, "").trim();
}

export default function TrackOrderPage() {
  const [searchParams] = useSearchParams();

  const [orderNumber, setOrderNumber] = useState(
    searchParams.get("order_number") ?? ""
  );
  const [email, setEmail] = useState(searchParams.get("email") ?? "");
  const [order, setOrder] = useState<OrderRead | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const autoLoadedRef = useRef(false);
  const [showForm, setShowForm] = useState(true);

  async function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();

    if (!orderNumber.trim() || !email.trim()) {
      setError("Введіть номер замовлення та email.");
      return;
    }

    try {
      const data = await trackOrder({
        order_number: orderNumber.trim(),
        email: email.trim(),
      });

      setOrder(data);
      setShowForm(false);
    } catch (err) {
      console.error(err);
      setOrder(null);
      setError("Замовлення з таким номером та email не знайдено.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (autoLoadedRef.current) return;
    if (!orderNumber || !email) return;

    autoLoadedRef.current = true;

    setTimeout(() => {
      handleSubmit();
    }, 0);
  }, [orderNumber, email]);

  return (
    <div className="store-page">
      <Header />

      <main className="profile-page">
        <section className="profile-orders-card">
          <div className="profile-orders-header">
            <h1>Перевірити замовлення</h1>
          </div>
          {showForm && (
            <form onSubmit={handleSubmit} className="checkout-form">
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="Номер замовлення"
              className="checkout-input"
            />

            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              type="email"
              className="checkout-input"
            />

            <button type="submit" className="checkout-submit-btn" disabled={loading}>
              {loading ? "Перевірка..." : "Перевірити"}
            </button>
          </form>
          )}

          {error && <div className="search-empty-box">{error}</div>}

          {order && (
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
                        {item.image_url_snapshot && (
                          <img
                            src={item.image_url_snapshot}
                            alt={item.product_name_snapshot}
                            className="order-details-item-image"
                          />
                        )}
  
                        <div className="order-details-item-title">
                          {cleanOrderItemName(item.product_name_snapshot)}
                        </div>
                      </div>
  
                      <div className="order-details-item-right">
                        <span>{item.quantity} шт.</span>
                        <strong>{item.price_snapshot} грн</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </main>
  
        <Footer />
      </div>
    );
  }