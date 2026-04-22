import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import {
  getAdminComplaints,
  updateAdminComplaintStatus,
  type AdminComplaint,
} from "../api/adminApi";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

type ComplaintFilter = "all" | "new" | "in_progress" | "resolved" | "rejected";

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

export default function AdminComplaintsPage() {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [complaints, setComplaints] = useState<AdminComplaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState<ComplaintFilter>("all");

  useEffect(() => {
    async function loadComplaints() {
      if (!token) return;

      try {
        setLoading(true);
        setError("");
        const data = await getAdminComplaints(token);
        setComplaints(data);
      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити скарги");
      } finally {
        setLoading(false);
      }
    }

    loadComplaints();
  }, [token]);

  async function handleStatusChange(
    complaintId: number,
    nextStatus: "in_progress" | "resolved" | "rejected"
  ) {
    if (!token) return;

    try {
      const updated = await updateAdminComplaintStatus(complaintId, nextStatus, token);
      setComplaints((prev) =>
        prev.map((complaint) => (complaint.id === complaintId ? updated : complaint))
      );
      showToast("Статус скарги оновлено");
    } catch (err) {
      console.error(err);
      showToast("Не вдалося оновити статус скарги", "error");
    }
  }

  const filteredComplaints = useMemo(() => {
    if (statusFilter === "all") return complaints;
    return complaints.filter((complaint) => complaint.status === statusFilter);
  }, [complaints, statusFilter]);

  return (
    <AdminLayout title="Скарги">
      <div className="admin-orders-filters">
        <button
          className={`admin-filter-btn ${statusFilter === "all" ? "active" : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          Усі
        </button>
        <button
          className={`admin-filter-btn ${statusFilter === "new" ? "active" : ""}`}
          onClick={() => setStatusFilter("new")}
        >
          Нові
        </button>
        <button
          className={`admin-filter-btn ${statusFilter === "in_progress" ? "active" : ""}`}
          onClick={() => setStatusFilter("in_progress")}
        >
          В обробці
        </button>
        <button
          className={`admin-filter-btn ${statusFilter === "resolved" ? "active" : ""}`}
          onClick={() => setStatusFilter("resolved")}
        >
          Вирішені
        </button>
        <button
          className={`admin-filter-btn ${statusFilter === "rejected" ? "active" : ""}`}
          onClick={() => setStatusFilter("rejected")}
        >
          Відхилені
        </button>
      </div>

      {loading ? (
        <div className="admin-empty-box">Завантаження...</div>
      ) : error ? (
        <div className="admin-empty-box">{error}</div>
      ) : filteredComplaints.length === 0 ? (
        <div className="admin-empty-box">Скарг ще немає.</div>
      ) : (
        <div className="admin-complaints-list">
          {filteredComplaints.map((complaint) => (
            <div key={complaint.id} className="admin-complaint-card">
              <div className="admin-complaint-top">
                <div>
                  <div className="admin-complaint-number">{complaint.complaint_number}</div>
                  <div className="admin-complaint-meta">
                    {complaint.email || "Без email"} • {new Date(complaint.created_at).toLocaleString("uk-UA")}
                  </div>
                  {complaint.order_number && (
                    <div className="admin-complaint-meta">
                      Замовлення: {complaint.order_number}
                    </div>
                  )}
                </div>

                <span className={`profile-order-status status-${complaint.status}`}>
                  {formatComplaintStatus(complaint.status)}
                </span>
              </div>

              <div className="admin-complaint-topic">{complaint.topic}</div>
              <div className="admin-complaint-message">{complaint.message}</div>

              {complaint.photos.length > 0 && (
                <div className="admin-complaint-photos">
                  {complaint.photos.map((photo) => (
                    <img
                      key={photo.id}
                      src={photo.image_url}
                      alt="Complaint"
                      className="admin-complaint-photo"
                    />
                  ))}
                </div>
              )}

              {complaint.status !== "resolved" && complaint.status !== "rejected" && (
                <div className="admin-order-actions">
                  {complaint.status === "new" && (
                    <button
                      className="admin-filter-btn"
                      onClick={() => handleStatusChange(complaint.id, "in_progress")}
                    >
                      Взяти в роботу
                    </button>
                  )}

                  <button
                    className="admin-complete-btn"
                    onClick={() => handleStatusChange(complaint.id, "resolved")}
                  >
                    Вирішено
                  </button>

                  <button
                    className="admin-cancel-btn"
                    onClick={() => handleStatusChange(complaint.id, "rejected")}
                  >
                    Відхилити
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}