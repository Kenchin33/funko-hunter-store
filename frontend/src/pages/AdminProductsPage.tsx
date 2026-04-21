import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../components/AdminLayout";
import { getAdminProducts } from "../api/adminApi";
import type { Product } from "../types/product";
import { useAuth } from "../hooks/useAuth";

export default function AdminProductsPage() {
  const { token } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
                <th>Назва</th>
                <th>Категорія</th>
                <th>Підкатегорія</th>
                <th>Рідкість</th>
                <th>Новинка</th>
                <th>Активний</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.category}</td>
                  <td>{product.subcategory || "—"}</td>
                  <td>{product.rarity}</td>
                  <td>{product.is_new ? "Так" : "Ні"}</td>
                  <td>{product.is_active ? "Так" : "Ні"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
}