import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchProducts } from "../api/productApi";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ProductCard from "../components/ProductCard";
import type { Product } from "../types/product";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function runSearch() {
      if (!query) {
        setProducts([]);
        return;
      }

      try {
        setLoading(true);
        const data = await searchProducts(query);
        setProducts(data);
      } catch (error) {
        console.error("Search failed:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    runSearch();
  }, [query]);

  return (
    <div className="store-page">
      <Header />

      <main className="search-page">
        <div className="search-page-header">
          <h1>Результати пошуку</h1>
          {query && (
            <p className="search-page-query">
              За запитом: <strong>{query}</strong>
            </p>
          )}
        </div>

        {!query ? (
          <div className="search-empty-box">
            Введіть назву фігурки або серії у пошуку зверху.
          </div>
        ) : loading ? (
          <div className="store-loading">Пошук...</div>
        ) : products.length === 0 ? (
          <div className="search-empty-box">
            За вашим запитом нічого не знайдено.
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={`${product.id}-${product.slug}`} product={product} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}