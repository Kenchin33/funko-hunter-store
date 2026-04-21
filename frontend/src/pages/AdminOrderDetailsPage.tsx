import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { getAdminOrderByNumber } from "../api/adminApi";
import type { OrderRead } from "../api/orderApi";
import { useAuth } from "../hooks/useAuth";
import { updateAdminOrderStatus } from "../api/adminApi";
import { useToast } from "../hooks/useToast";

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

export default function AdminOrderDetailsPage() {
  const { orderNumber } = useParams();
  const { token } = useAuth();
  const { showToast } = useToast();

  const [order, setOrder] = useState<OrderRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadOrder() {
      if (!token || !orderNumber) return;

      try {
        setLoading(true);
        setError("");
        const data = await getAdminOrderByNumber(orderNumber, token);
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

  async function handleStatusChange(nextStatus: "resolved" | "rejected") {
    if (!token || !orderNumber) return;
  
    try {
      const updated = await updateAdminOrderStatus(orderNumber, nextStatus, token);
      setOrder(updated);
      showToast(
        nextStatus === "resolved"
          ? "Замовлення позначено як виконане"
          : "Замовлення скасовано",
        nextStatus === "rejected" ? "error" : "default"
      );
    } catch (err) {
      console.error(err);
      showToast("Не вдалося оновити статус замовлення", "error");
    }
  }

  return (
    <AdminLayout title={`Замовлення ${orderNumber ?? ""}`}>
      {loading ? (
        <div className="admin-empty-box">Завантаження...</div>
      ) : error ? (
        <div className="admin-empty-box">{error}</div>
      ) : !order ? (
        <div className="admin-empty-box">Замовлення не знайдено.</div>
      ) : (
        <div className="admin-order-card">
          <div className="admin-order-top">
            <div>
            {order.status === "new" && (
              <div className="admin-order-actions">
                <button
                  className="admin-complete-btn"
                  onClick={() => handleStatusChange("resolved")}
                  type="button"
                >
                  Позначити як виконане
                </button>

                <button
                  className="admin-cancel-btn"
                  onClick={() => handleStatusChange("rejected")}
                  type="button"
                >
                  Скасувати замовлення
                </button>
              </div>
            )}
              <h2>{order.order_number}</h2>
              <p>
                {order.customer_first_name} {order.customer_last_name}
              </p>
              <p>{order.customer_email}</p>
              <p>{order.customer_phone}</p>
            </div>

            <div className="admin-order-summary">
            <span className={`profile-order-status status-${order.status}`}>
              {formatStatus(order.status)}
            </span>
              <strong>{order.total_amount} грн</strong>
            </div>
          </div>

          <div className="admin-order-delivery">
            Доставка: {order.delivery_city}, відділення {order.delivery_branch}
          </div>

          <div className="admin-order-items">
            {order.items.map((item) => (
              <div key={item.id} className="admin-order-item">
                <div className="admin-order-item-left">
                  {item.image_url_snapshot ? (
                    <img
                      src={item.image_url_snapshot}
                      alt={item.product_name_snapshot}
                      className="admin-order-item-image"
                    />
                  ) : (
                    <div className="admin-order-item-image admin-order-item-image-placeholder">
                      No image
                    </div>
                  )}

                  <div className="admin-order-item-title">
                    {item.product_name_snapshot}
                  </div>
                </div>

                <div className="admin-order-item-right">
                  {item.quantity} × {item.price_snapshot} грн
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AdminLayout>
  );
}