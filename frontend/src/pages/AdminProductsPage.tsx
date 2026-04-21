import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { getAdminProducts } from "../api/adminApi";
import type { Product } from "../types/product";
import { useAuth } from "../hooks/useAuth";
import { deleteAdminProduct } from "../api/adminApi";
import { useToast } from "../hooks/useToast";

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { showToast } = useToast();

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

  return (
    <AdminLayout title="Товари">
      <div className="admin-page-actions">
        <Link to="/admin/products/new" className="admin-primary-btn">
          Додати товар
        </Link>
      </div>

      {loading ? (
        <div className="admin-empty-box">Завантаження...</div>
      ) : error ? (
        <div className="admin-empty-box">{error}</div>
      ) : products.length === 0 ? (
        <div className="admin-empty-box">Товарів ще немає.</div>
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
              {products.map((product) => (
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