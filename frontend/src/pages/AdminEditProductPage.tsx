import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import AdminProductForm from "../components/AdminProductForm";
import {
  getAdminProductById,
  updateAdminProduct,
  type AdminProductCreatePayload,
} from "../api/adminApi";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

export default function AdminEditProductPage() {
  const { productId } = useParams();
  const { token } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState<AdminProductCreatePayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!token || !productId) return;

      try {
        setLoading(true);
        const product = await getAdminProductById(Number(productId), token);

        setInitialData({
            name: product.name ?? "",
            slug: product.slug ?? "",
            series: product.series ?? "",
            product_number: product.product_number ?? "",
            category: product.category ?? "",
            subcategory: product.subcategory ?? "",
            description: product.short_description ?? "",
            rarity: product.rarity ?? "regular",
            is_new: product.is_new,
            is_active: product.is_active,
            images: [
              { image_url: product.images[0]?.image_url ?? "", sort_order: 0 },
              { image_url: product.images[1]?.image_url ?? "", sort_order: 1 },
            ],
            aliases:
              product.aliases.length > 0
                ? product.aliases.map((alias) => ({ alias: alias.alias ?? "" }))
                : [{ alias: "" }],
            variants:
              product.variants.length >= 2
                ? product.variants.map((variant) => ({
                    slug: variant.slug ?? "",
                    variant_name: variant.variant_name ?? "",
                    price: Number(variant.price ?? 0),
                    compare_at_price: variant.compare_at_price
                      ? Number(variant.compare_at_price)
                      : null,
                    availability_status: variant.availability_status ?? "in_stock",
                    delivery_eta: variant.delivery_eta ?? null,
                    stock_quantity: variant.stock_quantity ?? 0,
                    is_box_damaged: variant.is_box_damaged,
                    is_active: variant.is_active,
                  }))
                : [
                    {
                      slug: "",
                      variant_name: "Стандартна коробка",
                      price: 0,
                      compare_at_price: null,
                      availability_status: "in_stock",
                      delivery_eta: null,
                      stock_quantity: 0,
                      is_box_damaged: false,
                      is_active: true,
                    },
                    {
                      slug: "",
                      variant_name: "Пошкоджена коробка",
                      price: 0,
                      compare_at_price: null,
                      availability_status: "in_stock",
                      delivery_eta: null,
                      stock_quantity: 0,
                      is_box_damaged: true,
                      is_active: true,
                    },
                  ],
          });
      } catch (err) {
        console.error(err);
        showToast("Не вдалося завантажити товар", "error");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId, token, showToast]);

  async function handleSubmit(payload: AdminProductCreatePayload) {
    if (!token || !productId) return;

    try {
      setSubmitting(true);
      await updateAdminProduct(Number(productId), payload, token);
      showToast("Товар успішно оновлено");
      navigate("/admin/products");
    } catch (err) {
      console.error(err);
      showToast("Не вдалося оновити товар", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AdminLayout title="Редагувати товар">
      {loading || !initialData ? (
        <div className="admin-empty-box">Завантаження...</div>
      ) : (
        <AdminProductForm
          initialData={initialData}
          submitLabel="Зберегти зміни"
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      )}
    </AdminLayout>
  );
}