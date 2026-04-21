import { useState } from "react";
import type { AdminProductCreatePayload } from "../api/adminApi";

interface AdminProductFormProps {
  initialData?: AdminProductCreatePayload;
  submitLabel: string;
  onSubmit: (payload: AdminProductCreatePayload) => Promise<void>;
  submitting: boolean;
}

export default function AdminProductForm({
  initialData,
  submitLabel,
  onSubmit,
  submitting,
}: AdminProductFormProps) {
  const [form, setForm] = useState<AdminProductCreatePayload>(
    initialData ?? {
      name: "",
      slug: "",
      series: "",
      product_number: "",
      category: "",
      subcategory: "",
      short_description: "",
      rarity: "regular",
      is_new: false,
      is_active: true,
      images: [
        { image_url: "", sort_order: 0 },
        { image_url: "", sort_order: 1 },
      ],
      aliases: [{ alias: "" }],
      variants: [
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
    }
  );

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

  function handleImageChange(index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.map((img, i) =>
        i === index ? { ...img, image_url: value } : img
      ),
    }));
  }

  function handleAliasChange(index: number, value: string) {
    setForm((prev) => ({
      ...prev,
      aliases: prev.aliases.map((alias, i) =>
        i === index ? { ...alias, alias: value } : alias
      ),
    }));
  }

  function addAliasField() {
    setForm((prev) => ({
      ...prev,
      aliases: [...prev.aliases, { alias: "" }],
    }));
  }
  
  function removeAliasField(index: number) {
    setForm((prev) => ({
      ...prev,
      aliases:
        prev.aliases.length === 1
          ? [{ alias: "" }]
          : prev.aliases.filter((_, i) => i !== index),
    }));
  }

  function handleVariantChange(
    index: number,
    field: string,
    value: string | number | boolean | null
  ) {
    setForm((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      ),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(form);
  }

  return (
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
          value={form.subcategory ?? ""}
          onChange={handleChange}
        />

        <select name="rarity" value={form.rarity} onChange={handleChange}>
          <option value="regular">Звичайна</option>
          <option value="exclusive">Ексклюзив</option>
          <option value="limited">Лімітка</option>
        </select>
      </div>

      <textarea
        name="short_description"
        placeholder="Короткий опис"
        value={form.short_description ?? ""}
        onChange={handleChange}
        className="admin-form-textarea"
      />

      <div className="admin-checkboxes">
        <label>
          <input type="checkbox" name="is_new" checked={form.is_new} onChange={handleChange} />
          Новинка
        </label>
        <label>
          <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
          Активний товар
        </label>
      </div>

      <div className="admin-form-section">
        <h3>Фото</h3>
        <div className="admin-form-grid">
          <input
            placeholder="URL фото 1"
            value={form.images[0]?.image_url ?? ""}
            onChange={(e) => handleImageChange(0, e.target.value)}
          />
          <input
            placeholder="URL фото 2"
            value={form.images[1]?.image_url ?? ""}
            onChange={(e) => handleImageChange(1, e.target.value)}
          />
        </div>
      </div>

      <div className="admin-form-section">
        <div className="admin-form-section-header">
          <h3>Aliases</h3>

          <button
            type="button"
            className="admin-secondary-btn"
            onClick={addAliasField}
          >
            Додати alias
          </button>
        </div>

        <div className="admin-dynamic-list">
          {form.aliases.map((alias, index) => (
            <div key={index} className="admin-dynamic-row">
              <input
                placeholder={`Alias ${index + 1}`}
                value={alias.alias}
                onChange={(e) => handleAliasChange(index, e.target.value)}
              />

              <button
                type="button"
                className="admin-remove-btn"
                onClick={() => removeAliasField(index)}
              >
                Видалити
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="admin-form-section">
        <h3>Варіанти</h3>

        {form.variants.map((variant, index) => (
          <div key={index} className="admin-variant-card">
            <h4>{index === 0 ? "Стандартна коробка" : "Пошкоджена коробка"}</h4>

            <div className="admin-form-grid">
              <input
                placeholder="Slug варіанта"
                value={variant.slug}
                onChange={(e) => handleVariantChange(index, "slug", e.target.value)}
              />
              <input
                placeholder="Назва варіанта"
                value={variant.variant_name}
                onChange={(e) => handleVariantChange(index, "variant_name", e.target.value)}
              />
              <div className="admin-field">
                <label>Ціна</label>
                <input
                  type="number"
                  value={variant.price}
                  onChange={(e) =>
                    handleVariantChange(index, "price", Number(e.target.value))
                  }
                />
              </div>
              <input
                placeholder="Стара ціна"
                type="number"
                value={variant.compare_at_price ?? ""}
                onChange={(e) =>
                  handleVariantChange(
                    index,
                    "compare_at_price",
                    e.target.value ? Number(e.target.value) : null
                  )
                }
              />
              <select
                value={variant.availability_status}
                onChange={(e) =>
                  handleVariantChange(index, "availability_status", e.target.value)
                }
              >
                <option value="in_stock">В наявності</option>
                <option value="preorder">Передзамовлення</option>
              </select>
              <input
                placeholder="Час доставки"
                value={variant.delivery_eta ?? ""}
                onChange={(e) =>
                  handleVariantChange(
                    index,
                    "delivery_eta",
                    e.target.value || null
                  )
                }
              />
              <div className="admin-field">
                <label>Кількість на складі</label>
                <input
                  type="number"
                  value={variant.stock_quantity}
                  onChange={(e) =>
                    handleVariantChange(index, "stock_quantity", Number(e.target.value))
                  }
                />
              </div>
            </div>

            <div className="admin-checkboxes">
              <label>
                <input
                  type="checkbox"
                  checked={variant.is_box_damaged}
                  onChange={(e) =>
                    handleVariantChange(index, "is_box_damaged", e.target.checked)
                  }
                />
                Пошкоджена коробка
              </label>

              <label>
                <input
                  type="checkbox"
                  checked={variant.is_active}
                  onChange={(e) =>
                    handleVariantChange(index, "is_active", e.target.checked)
                  }
                />
                Активний варіант
              </label>
            </div>
          </div>
        ))}
      </div>

      <button type="submit" className="admin-primary-btn" disabled={submitting}>
        {submitting ? "Збереження..." : submitLabel}
      </button>
    </form>
  );
}