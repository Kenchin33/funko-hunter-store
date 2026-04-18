import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchProducts } from "../api/productApi";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ProductVariantCard from "../components/ProductVariantCard";
import type { ProductCardItem } from "../types/productCard";
import { mapProductsToCardItems } from "../utils/productCards";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  const [items, setItems] = useState<ProductCardItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function runSearch() {
      if (!query) {
        setItems([]);
        return;
      }

      try {
        setLoading(true);
        const data = await searchProducts(query);
        const mapped = mapProductsToCardItems(data);
        setItems(mapped);
      } catch (error) {
        console.error("Search failed:", error);
        setItems([]);
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
        ) : items.length === 0 ? (
          <div className="search-empty-box">
            За вашим запитом нічого не знайдено.
          </div>
        ) : (
          <div className="product-grid">
            {items.map((item) => (
              <ProductVariantCard
                key={`${item.productId}-${item.variantId}`}
                item={item}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}