import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { deleteAdminProduct, getAdminProducts } from "../api/adminApi";
import type { Product } from "../types/product";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";

type RarityFilter = "all" | "regular" | "exclusive" | "limited";
type BoxFilter = "all" | "normal" | "damaged";
type StatusFilter = "all" | "in_stock" | "preorder";
type BooleanFilter = "all" | "yes" | "no";
type SortOption = "newest" | "oldest" | "name_asc" | "name_desc";

export default function AdminProductsPage() {
  const { token } = useAuth();
  const { showToast } = useToast();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>("all");
  const [boxFilter, setBoxFilter] = useState<BoxFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [isNewFilter, setIsNewFilter] = useState<BooleanFilter>("all");
  const [isActiveFilter, setIsActiveFilter] = useState<BooleanFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("newest");

  useEffect(() => {
    async function loadProducts() {
      if (!token) return;

      try {
        setLoading(true);
        setError("");
        const data = await getAdminProducts(token);
        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("Не вдалося завантажити товари");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, [token]);

  async function handleDelete(productId: number) {
    if (!token) return;

    const confirmed = window.confirm("Точно видалити товар?");
    if (!confirmed) return;

    try {
      await deleteAdminProduct(productId, token);
      setProducts((prev) => prev.filter((product) => product.id !== productId));
      showToast("Товар видалено");
    } catch (err) {
      console.error(err);
      showToast("Не вдалося видалити товар", "error");
    }
  }

  const filteredProducts = useMemo(() => {
    let result = [...products];

    const normalizedQuery = searchQuery.trim().toLowerCase();

    if (normalizedQuery) {
      result = result.filter((product) => {
        const aliasText = (product.aliases ?? [])
          .map((alias) => alias.alias?.toLowerCase() ?? "")
          .join(" ");

        const variantText = (product.variants ?? [])
          .map((variant) => `${variant.slug ?? ""} ${variant.variant_name ?? ""}`.toLowerCase())
          .join(" ");

        const haystack = [
          product.name ?? "",
          product.slug ?? "",
          product.series ?? "",
          product.category ?? "",
          product.subcategory ?? "",
          product.product_number ?? "",
          aliasText,
          variantText,
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedQuery);
      });
    }

    if (rarityFilter !== "all") {
      result = result.filter((product) => product.rarity === rarityFilter);
    }

    if (boxFilter === "damaged") {
      result = result.filter((product) =>
        product.variants?.some((variant) => variant.is_box_damaged)
      );
    }

    if (boxFilter === "normal") {
      result = result.filter((product) =>
        product.variants?.some((variant) => !variant.is_box_damaged)
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((product) =>
        product.variants?.some(
          (variant) =>
            variant.is_active && variant.availability_status === statusFilter
        )
      );
    }

    if (isNewFilter !== "all") {
      result = result.filter((product) =>
        isNewFilter === "yes" ? product.is_new : !product.is_new
      );
    }

    if (isActiveFilter !== "all") {
      result = result.filter((product) =>
        isActiveFilter === "yes" ? product.is_active : !product.is_active
      );
    }

    if (sortOption === "name_asc") {
      result.sort((a, b) => (a.name ?? "").localeCompare(b.name ?? ""));
    }

    if (sortOption === "name_desc") {
      result.sort((a, b) => (b.name ?? "").localeCompare(a.name ?? ""));
    }

    if (sortOption === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.created_at ?? "").getTime() - new Date(a.created_at ?? "").getTime()
      );
    }

    if (sortOption === "oldest") {
      result.sort(
        (a, b) =>
          new Date(a.created_at ?? "").getTime() - new Date(b.created_at ?? "").getTime()
      );
    }

    return result;
  }, [
    products,
    searchQuery,
    rarityFilter,
    boxFilter,
    statusFilter,
    isNewFilter,
    isActiveFilter,
    sortOption,
  ]);

  function resetFilters() {
    setSearchQuery("");
    setRarityFilter("all");
    setBoxFilter("all");
    setStatusFilter("all");
    setIsNewFilter("all");
    setIsActiveFilter("all");
    setSortOption("newest");
  }

  return (
    <AdminLayout title="Товари">
      <div className="admin-page-actions">
        <Link to="/admin/products/new" className="admin-primary-btn">
          Додати товар
        </Link>
      </div>

      <div className="admin-products-toolbar">
        <input
          type="text"
          className="admin-search-input"
          placeholder="Пошук товарів..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="admin-products-filters">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
          >
            <option value="newest">Новіші</option>
            <option value="oldest">Старіші</option>
            <option value="name_asc">Назва A-Z</option>
            <option value="name_desc">Назва Z-A</option>
          </select>

          <select
            value={rarityFilter}
            onChange={(e) => setRarityFilter(e.target.value as RarityFilter)}
          >
            <option value="all">Усі рідкості</option>
            <option value="regular">Звичайна</option>
            <option value="exclusive">Ексклюзив</option>
            <option value="limited">Лімітка</option>
          </select>

          <select
            value={boxFilter}
            onChange={(e) => setBoxFilter(e.target.value as BoxFilter)}
          >
            <option value="all">Усі коробки</option>
            <option value="normal">Ціла коробка</option>
            <option value="damaged">Пошкоджена коробка</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          >
            <option value="all">Усі статуси</option>
            <option value="in_stock">В наявності</option>
            <option value="preorder">Передзамовлення</option>
          </select>

          <select
            value={isNewFilter}
            onChange={(e) => setIsNewFilter(e.target.value as BooleanFilter)}
          >
            <option value="all">Усі товари</option>
            <option value="yes">Лише новинки</option>
            <option value="no">Не новинки</option>
          </select>

          <select
            value={isActiveFilter}
            onChange={(e) => setIsActiveFilter(e.target.value as BooleanFilter)}
          >
            <option value="all">Усі активності</option>
            <option value="yes">Активні</option>
            <option value="no">Неактивні</option>
          </select>

          <button
            type="button"
            className="admin-secondary-btn"
            onClick={resetFilters}
          >
            Скинути
          </button>
        </div>
      </div>

      {loading ? (
        <div className="admin-empty-box">Завантаження...</div>
      ) : error ? (
        <div className="admin-empty-box">{error}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="admin-empty-box">Товари не знайдено.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Фото</th>
                <th>Назва</th>
                <th>Категорія</th>
                <th>Підкатегорія</th>
                <th>Рідкість</th>
                <th>Новинка</th>
                <th>Активний</th>
                <th>Дії</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id}>
                  <td>
                    {product.images[0]?.image_url ? (
                      <img
                        src={product.images[0].image_url}
                        alt={product.name}
                        className="admin-product-thumb"
                      />
                    ) : (
                      <div className="admin-product-thumb admin-product-thumb-placeholder">
                        —
                      </div>
                    )}
                  </td>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.subcategory || "—"}</td>
                  <td>{product.rarity}</td>
                  <td>{product.is_new ? "Так" : "Ні"}</td>
                  <td>{product.is_active ? "Так" : "Ні"}</td>
                  <td>
                    <div className="admin-table-actions">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="admin-table-edit-btn"
                      >
                        Редагувати
                      </Link>
                      <button
                        className="admin-table-delete-btn"
                        onClick={() => handleDelete(product.id)}
                        type="button"
                      >
                        Видалити
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}