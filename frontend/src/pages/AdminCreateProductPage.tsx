import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import AdminProductForm from "../components/AdminProductForm";
import { createAdminProduct, type AdminProductCreatePayload } from "../api/adminApi";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

export default function AdminCreateProductPage() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(payload: AdminProductCreatePayload) {
    if (!token) return;

    try {
      setSubmitting(true);
      await createAdminProduct(payload, token);
      showToast("Товар успішно створено");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      showToast("Не вдалося створити товар", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminLayout title="Додати товар">
      <AdminProductForm
        submitLabel="Створити товар"
        onSubmit={handleSubmit}
        submitting={submitting}
      />
    </AdminLayout>
  );
}