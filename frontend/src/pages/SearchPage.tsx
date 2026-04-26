import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getAllProducts, getInStockProducts, searchProducts } from "../api/productApi";
import Footer from "../components/Footer";
import Header from "../components/Header";
import CatalogPageLayout from "../components/CatalogPageLayout";
import type { ProductCardItem } from "../types/productCard";
import { mapProductsToCardItems } from "../utils/productCards";

type StatusFilter = "all" | "in_stock" | "preorder";

export default function SearchPage() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q")?.trim() ?? "";
  const statusParam =
  searchParams.get("status") ?? searchParams.get("availability_status");

  const initialStatusFilter: StatusFilter =
    statusParam === "in_stock" || statusParam === "preorder"
      ? statusParam
      : "all";

  const [items, setItems] = useState<ProductCardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function runSearch() {
      try {
        setLoading(true);
        setError("");
  
        const data = query
          ? await searchProducts(query)
          : initialStatusFilter === "in_stock"
            ? await getInStockProducts()
            : await getAllProducts();

        let mappedItems = mapProductsToCardItems(data);

        if (initialStatusFilter === "in_stock") {
          mappedItems = mappedItems.filter(
            (item) => item.availabilityStatus === "in_stock"
          );
        }

        setItems(mappedItems);
      } catch (err) {
        console.error("Search failed:", err);
        setItems([]);
        setError("Не вдалося виконати пошук.");
      } finally {
        setLoading(false);
      }
    }
  
    runSearch();
  }, [query, initialStatusFilter]);

  const title =
    initialStatusFilter === "in_stock"
      ? "Актуальна наявність"
      : initialStatusFilter === "preorder"
        ? "Передзамовлення"
        : "Результати пошуку";

  const subtitle = query ? `За запитом: ${query}` : undefined;

  return (
    <div className="store-page">
      <Header />
      <CatalogPageLayout
        key={`search-${query}-${initialStatusFilter}`}
        title={title}
        subtitle={subtitle}
        items={items}
        loading={loading}
        error={error}
        emptyText="За вашим запитом і вибраними фільтрами нічого не знайдено."
        initialStatusFilter={initialStatusFilter}
      />
      <Footer />
    </div>
  );
}