import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchProducts } from "../api/productApi";
import Footer from "../components/Footer";
import Header from "../components/Header";
import CatalogPageLayout from "../components/CatalogPageLayout";
import type { ProductCardItem } from "../types/productCard";
import { mapProductsToCardItems } from "../utils/productCards";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  const [items, setItems] = useState<ProductCardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function runSearch() {
      if (!query) {
        setItems([]);
        setError("");
        return;
      }

      try {
        setLoading(true);
        setError("");
        const data = await searchProducts(query);
        setItems(mapProductsToCardItems(data));
      } catch (err) {
        console.error("Search failed:", err);
        setItems([]);
        setError("Не вдалося виконати пошук.");
      } finally {
        setLoading(false);
      }
    }

    runSearch();
  }, [query]);

  return (
    <div className="store-page">
      <Header />
      <CatalogPageLayout
        key={`search-${query}`}
        title="Результати пошуку"
        subtitle={query ? `За запитом: ${query}` : undefined}
        items={items}
        loading={loading}
        error={error}
        emptyText="За вашим запитом і вибраними фільтрами нічого не знайдено."
      />
      <Footer />
    </div>
  );
}