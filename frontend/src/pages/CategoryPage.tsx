import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCatalogProducts,
  getNewProducts,
  getPreorderCatalogProducts,
} from "../api/productApi";
import Footer from "../components/Footer";
import Header from "../components/Header";
import CatalogPageLayout from "../components/CatalogPageLayout";
import { CATEGORY_CONFIG } from "../config/catalog";
import type { ProductCardItem } from "../types/productCard";
import { mapProductsToCardItems } from "../utils/productCards";

function prettifySlug(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function CategoryPage() {
  const { category, subcategory } = useParams();

  const [items, setItems] = useState<ProductCardItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const categoryKey = category as keyof typeof CATEGORY_CONFIG | undefined;
  const categoryConfig = categoryKey ? CATEGORY_CONFIG[categoryKey] : undefined;

  useEffect(() => {
    async function loadCatalog() {
      if (!category) return;

      try {
        setLoading(true);
        setError("");

        let data;

        if (category === "new") {
          data = await getNewProducts();
        } else if (category === "preorder") {
          data = await getPreorderCatalogProducts();
        } else if (subcategory === "other" && categoryConfig) {
          data = await getCatalogProducts(
            category,
            "other",
            categoryConfig.knownSubcategories
          );
        } else {
          data = await getCatalogProducts(category, subcategory);
        }

        setItems(mapProductsToCardItems(data));
      } catch (err) {
        console.error("Failed to load category page:", err);
        setItems([]);
        setError("Не вдалося завантажити товари для цієї сторінки.");
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, [category, subcategory, categoryConfig]);

  const title =
    category === "new"
      ? "Новинки"
      : category === "preorder"
      ? "Передзамовлення"
      : subcategory
      ? subcategory === "other"
        ? `${categoryConfig?.label ?? prettifySlug(category ?? "")} — Інші`
        : `${categoryConfig?.label ?? prettifySlug(category ?? "")} — ${prettifySlug(subcategory)}`
      : categoryConfig?.label ?? prettifySlug(category ?? "");

  return (
    <div className="store-page">
      <Header />
      <CatalogPageLayout
        key={`catalog-${category ?? ""}-${subcategory ?? ""}`}
        title={title}
        items={items}
        loading={loading}
        error={error}
        emptyText="Для цієї сторінки товарів не знайдено."
      />
      <Footer />
    </div>
  );
}