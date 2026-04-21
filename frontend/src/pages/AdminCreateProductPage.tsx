import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { createAdminProduct } from "../api/adminApi";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

export default function AdminCreateProductPage() {
  const { token } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    slug: "",
    series: "",
    product_number: "",
    category: "",
    subcategory: "",
    description: "",
    rarity: "regular",
    is_new: false,
    is_active: true,
    image1: "",
    image2: "",
    variant_slug: "",
    variant_name: "Стандартна коробка",
    price: "",
    compare_at_price: "",
    availability_status: "in_stock",
    delivery_eta: "",
    stock_quantity: "0",
    is_box_damaged: false,
    variant_is_active: true,
  });

  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const target = e.target;
    const { name, value } = target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: target.checked,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!token) return;

    try {
      setSubmitting(true);

      await createAdminProduct(
        {
          name: form.name,
          slug: form.slug,
          series: form.series,
          product_number: form.product_number,
          category: form.category,
          subcategory: form.subcategory || null,
          description: form.description || null,
          rarity: form.rarity,
          is_new: form.is_new,
          is_active: form.is_active,
          images: [form.image1, form.image2]
            .filter(Boolean)
            .map((image, index) => ({
              image_url: image,
              sort_order: index,
            })),
          variants: [
            {
              slug: form.variant_slug,
              variant_name: form.variant_name,
              price: Number(form.price),
              compare_at_price: form.compare_at_price
                ? Number(form.compare_at_price)
                : null,
              availability_status: form.availability_status,
              delivery_eta: form.delivery_eta || null,
              stock_quantity: Number(form.stock_quantity),
              is_box_damaged: form.is_box_damaged,
              is_active: form.variant_is_active,
            },
          ],
        },
        token
      );

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
      <form className="admin-product-form" onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <input name="name" placeholder="Назва" value={form.name} onChange={handleChange} />
          <input name="slug" placeholder="Slug" value={form.slug} onChange={handleChange} />
          <input name="series" placeholder="Серія" value={form.series} onChange={handleChange} />
          <input
            name="product_number"
            placeholder="Номер товару"
            value={form.product_number}
            onChange={handleChange}
          />
          <input name="category" placeholder="Категорія" value={form.category} onChange={handleChange} />
          <input
            name="subcategory"
            placeholder="Підкатегорія"
            value={form.subcategory}
            onChange={handleChange}
          />

          <select name="rarity" value={form.rarity} onChange={handleChange}>
            <option value="regular">Звичайна</option>
            <option value="exclusive">Ексклюзив</option>
            <option value="limited">Лімітка</option>
          </select>

          <select
            name="availability_status"
            value={form.availability_status}
            onChange={handleChange}
          >
            <option value="in_stock">В наявності</option>
            <option value="preorder">Передзамовлення</option>
          </select>

          <input
            name="delivery_eta"
            placeholder="Час доставки"
            value={form.delivery_eta}
            onChange={handleChange}
          />
          <input
            name="stock_quantity"
            placeholder="Кількість"
            value={form.stock_quantity}
            onChange={handleChange}
          />
          <input
            name="image1"
            placeholder="URL фото 1"
            value={form.image1}
            onChange={handleChange}
          />
          <input
            name="image2"
            placeholder="URL фото 2"
            value={form.image2}
            onChange={handleChange}
          />
          <input
            name="variant_slug"
            placeholder="Slug варіанта"
            value={form.variant_slug}
            onChange={handleChange}
          />
          <input
            name="variant_name"
            placeholder="Назва варіанта"
            value={form.variant_name}
            onChange={handleChange}
          />
          <input name="price" placeholder="Ціна" value={form.price} onChange={handleChange} />
          <input
            name="compare_at_price"
            placeholder="Стара ціна"
            value={form.compare_at_price}
            onChange={handleChange}
          />
        </div>

        <textarea
          name="description"
          placeholder="Опис"
          value={form.description}
          onChange={handleChange}
          className="admin-form-textarea"
        />

        <div className="admin-checkboxes">
          <label><input type="checkbox" name="is_new" checked={form.is_new} onChange={handleChange} /> Новинка</label>
          <label><input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} /> Активний товар</label>
          <label><input type="checkbox" name="is_box_damaged" checked={form.is_box_damaged} onChange={handleChange} /> Пошкоджена коробка</label>
          <label><input type="checkbox" name="variant_is_active" checked={form.variant_is_active} onChange={handleChange} /> Активний варіант</label>
        </div>

        <button type="submit" className="admin-primary-btn" disabled={submitting}>
          {submitting ? "Створення..." : "Створити товар"}
        </button>
      </form>
    </AdminLayout>
  );
}