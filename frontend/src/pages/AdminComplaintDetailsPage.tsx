import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import {
  getAdminComplaintById,
  updateAdminComplaintStatus,
  type AdminComplaint,
} from "../api/adminApi";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

type ComplaintStatus = "new" | "in_progress" | "resolved" | "rejected";

function formatComplaintStatus(status: string) {
  switch (status) {
    case "new":
      return "Нова";
    case "in_progress":
      return "В обробці";
    case "resolved":
      return "Вирішена";
    case "rejected":
      return "Відхилена";
    default:
      return status;
  }
}

function formatSource(source: string) {
  switch (source) {
    case "assistant":
      return "AI-асистент";
    case "shop":
      return "Магазин";
    default:
      return source || "Невідомо";
  }
}

export default function AdminComplaintDetailsPage() {
  const { complaintId } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const { showToast } = useToast();

  const [complaint, setComplaint] = useState<AdminComplaint | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [error, setError] = useState("");

  const numericComplaintId = Number(complaintId);

  useEffect(() => {
    async function loadComplaint() {
      if (!token || !numericComplaintId  || Number.isNaN(numericComplaintId)) {
        setError("Некоректний номер скарги");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const data = await getAdminComplaintById(numericComplaintId, token);
        setComplaint(data);
      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити скаргу");
      } finally {
        setLoading(false);
      }
    }

    loadComplaint();
  }, [token, numericComplaintId]);

  async function handleStatusChange(nextStatus: ComplaintStatus) {
    if (!token || !complaint) return;

    try {
      setStatusLoading(true);

      const updated = await updateAdminComplaintStatus(
        complaint.id,
        nextStatus,
        token
      );

      setComplaint(updated);
      showToast("Статус скарги оновлено");
    } catch (err) {
      console.error(err);
      showToast("Не вдалося оновити статус скарги", "error");
    } finally {
      setStatusLoading(false);
    }
  }

  return (
    <AdminLayout title="Деталі скарги">
      <div className="admin-details-top">
        <button
          type="button"
          className="admin-filter-btn"
          onClick={() => navigate("/admin/complaints")}
        >
          ← До списку скарг
        </button>
      </div>

      {loading ? (
        <div className="admin-empty-box">Завантаження...</div>
      ) : error ? (
        <div className="admin-empty-box">{error}</div>
      ) : !complaint ? (
        <div className="admin-empty-box">Скаргу не знайдено.</div>
      ) : (
        <div className="admin-complaint-details-card">
          <div className="admin-complaint-details-header">
            <div>
              <h2>{complaint.complaint_number}</h2>
              <p>
                Створено:{" "}
                {new Date(complaint.created_at).toLocaleString("uk-UA")}
              </p>
            </div>

            <span className={`profile-order-status status-${complaint.status}`}>
              {formatComplaintStatus(complaint.status)}
            </span>
          </div>

          <div className="admin-complaint-details-grid">
            <div className="admin-complaint-detail-box">
              <span>Email клієнта</span>
              <strong>{complaint.email || "Не вказано"}</strong>
            </div>

            <div className="admin-complaint-detail-box">
              <span>Номер замовлення</span>
              <strong>
                {complaint.order_number ? (
                  <Link to={`/admin/orders/${complaint.order_number}`}>
                    {complaint.order_number}
                    </Link>
                ) : (
                    "Не вказано"
                )}
                </strong>
            </div>

            <div className="admin-complaint-detail-box">
              <span>Джерело</span>
              <strong>{formatSource(complaint.source)}</strong>
            </div>

            <div className="admin-complaint-detail-box">
              <span>Оновлено</span>
              <strong>
                {new Date(complaint.updated_at).toLocaleString("uk-UA")}
              </strong>
            </div>
          </div>

          <section className="admin-complaint-section">
            <h3>Тема</h3>
            <p>{complaint.topic || "Без теми"}</p>
          </section>

          <section className="admin-complaint-section">
            <h3>Текст скарги</h3>
            <p className="admin-complaint-full-message">
              {complaint.message}
            </p>
          </section>

          <section className="admin-complaint-section">
            <h3>Фото</h3>

            {complaint.photos.length === 0 ? (
              <p className="admin-muted-text">Фото не додано.</p>
            ) : (
              <div className="admin-complaint-details-photos">
                {complaint.photos.map((photo) => (
                  <a
                    key={photo.id}
                    href={photo.image_url}
                    target="_blank"
                    rel="noreferrer"
                    className="admin-complaint-details-photo-link"
                  >
                    <img
                      src={photo.image_url}
                      alt="Фото скарги"
                      className="admin-complaint-details-photo"
                    />
                  </a>
                ))}
              </div>
            )}
          </section>

          {complaint.status !== "resolved" && complaint.status !== "rejected" && (
            <section className="admin-complaint-section">
              <h3>Змінити статус</h3>

              <div className="admin-order-actions">
                {complaint.status === "new" && (
                  <button
                    type="button"
                    className="admin-filter-btn"
                    disabled={statusLoading}
                    onClick={() => handleStatusChange("in_progress")}
                  >
                    Взяти в роботу
                  </button>
                )}

                <button
                  type="button"
                  className="admin-complete-btn"
                  disabled={statusLoading}
                  onClick={() => handleStatusChange("resolved")}
                >
                  Вирішено
                </button>

                <button
                  type="button"
                  className="admin-cancel-btn"
                  disabled={statusLoading}
                  onClick={() => handleStatusChange("rejected")}
                >
                  Відхилити
                </button>
              </div>
            </section>
          )}
        </div>
      )}
    </AdminLayout>
  );
}