import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { getAdminOrders } from "../api/adminApi";
import type { OrderRead } from "../api/orderApi";
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

export default function AdminOrdersPage() {
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
        const data = await getAdminOrders(token);
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
    <AdminLayout title="Замовлення">
      {loading ? (
        <div className="admin-empty-box">Завантаження...</div>
      ) : error ? (
        <div className="admin-empty-box">{error}</div>
      ) : orders.length === 0 ? (
        <div className="admin-empty-box">Замовлень ще немає.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Номер</th>
                <th>Клієнт</th>
                <th>Email</th>
                <th>Телефон</th>
                <th>Статус</th>
                <th>Сума</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <Link
                      to={`/admin/orders/${order.order_number}`}
                      className="admin-order-link"
                    >
                      {order.order_number}
                    </Link>
                  </td>
                  <td>
                    {order.customer_first_name} {order.customer_last_name}
                  </td>
                  <td>{order.customer_email}</td>
                  <td>{order.customer_phone}</td>
                  <td>{formatStatus(order.status)}</td>
                  <td>{order.total_amount} грн</td>
                  <td>{new Date(order.created_at).toLocaleString("uk-UA")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}