import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCatalogProducts,
  getNewProducts,
  getPreorderCatalogProducts,
} from "../api/productApi";
import Footer from "../components/Footer";
import Header from "../components/Header";
import CatalogFilters from "../components/CatalogFilters";
import ProductVariantCard from "../components/ProductVariantCard";
import { CATEGORY_CONFIG } from "../config/catalog";
import type { ProductCardItem } from "../types/productCard";
import { mapProductsToCardItems } from "../utils/productCards";

type RarityFilter = "all" | "regular" | "exclusive" | "limited";
type BoxFilter = "all" | "normal" | "damaged";
type StatusFilter = "all" | "in_stock" | "preorder";
type SortOption =
  | "default"
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "name_desc";
type OpenDropdown = null | "sort" | "rarity" | "box" | "status";

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

  const [rarityFilter, setRarityFilter] = useState<RarityFilter>("all");
  const [boxFilter, setBoxFilter] = useState<BoxFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);

  const filtersRef = useRef<HTMLDivElement | null>(null);

  const categoryKey = category as keyof typeof CATEGORY_CONFIG | undefined;
  const categoryConfig = categoryKey ? CATEGORY_CONFIG[categoryKey] : undefined;

  useEffect(() => {
    async function loadCatalog() {
      if (!category) return;

      try {
        setLoading(true);

        let data;

        if (category === "new") {
          data = await getNewProducts();
        } else if (category === "preorder") {
          data = await getPreorderCatalogProducts();
        } else if (subcategory === "other" && categoryConfig) {
          data = await getCatalogProducts(
            category,
            "other",
            [...categoryConfig.knownSubcategories]
          );
        } else {
          data = await getCatalogProducts(category, subcategory);
        }

        setItems(mapProductsToCardItems(data));
      } catch (error) {
        console.error("Failed to load category page:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    loadCatalog();
  }, [category, subcategory, categoryConfig]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        filtersRef.current &&
        !filtersRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const rarityCounts = useMemo(() => {
    return {
      regular: items.filter((item) => item.rarity === "regular").length,
      exclusive: items.filter((item) => item.rarity === "exclusive").length,
      limited: items.filter((item) => item.rarity === "limited").length,
    };
  }, [items]);

  const boxCounts = useMemo(() => {
    return {
      normal: items.filter((item) => !item.isBoxDamaged).length,
      damaged: items.filter((item) => item.isBoxDamaged).length,
    };
  }, [items]);

  const statusCounts = useMemo(() => {
    return {
      in_stock: items.filter((item) => item.availabilityStatus === "in_stock")
        .length,
      preorder: items.filter((item) => item.availabilityStatus === "preorder")
        .length,
    };
  }, [items]);

  const filteredItems = useMemo(() => {
    let result = [...items];

    if (rarityFilter !== "all") {
      result = result.filter((item) => item.rarity === rarityFilter);
    }

    if (boxFilter === "normal") {
      result = result.filter((item) => !item.isBoxDamaged);
    }

    if (boxFilter === "damaged") {
      result = result.filter((item) => item.isBoxDamaged);
    }

    if (statusFilter !== "all") {
      result = result.filter((item) => item.availabilityStatus === statusFilter);
    }

    if (sortOption === "price_asc") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortOption === "price_desc") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortOption === "name_asc") {
      result.sort((a, b) => a.productName.localeCompare(b.productName));
    }

    if (sortOption === "name_desc") {
      result.sort((a, b) => b.productName.localeCompare(a.productName));
    }

    return result;
  }, [items, rarityFilter, boxFilter, statusFilter, sortOption]);

  function resetFilters() {
    setRarityFilter("all");
    setBoxFilter("all");
    setStatusFilter("all");
    setSortOption("default");
    setOpenDropdown(null);
  }

  const pageTitle =
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

      <main className="search-page">
        <div className="search-page-header">
          <h1>{pageTitle}</h1>
        </div>

        <div ref={filtersRef}>
          <CatalogFilters
            totalItems={items.length}
            filteredCount={filteredItems.length}
            rarityFilter={rarityFilter}
            setRarityFilter={setRarityFilter}
            boxFilter={boxFilter}
            setBoxFilter={setBoxFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sortOption={sortOption}
            setSortOption={setSortOption}
            openDropdown={openDropdown}
            setOpenDropdown={setOpenDropdown}
            rarityCounts={rarityCounts}
            boxCounts={boxCounts}
            statusCounts={statusCounts}
            resetFilters={resetFilters}
          />
        </div>

        {loading ? (
          <div className="store-loading">Завантаження...</div>
        ) : filteredItems.length === 0 ? (
          <div className="search-empty-box">
            Для цієї сторінки товарів не знайдено.
          </div>
        ) : (
          <div className="product-grid">
            {filteredItems.map((item) => (
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