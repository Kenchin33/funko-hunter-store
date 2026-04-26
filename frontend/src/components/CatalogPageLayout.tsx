import { useEffect, useMemo, useRef, useState } from "react";
import CatalogFilters from "./CatalogFilters";
import ProductVariantCard from "./ProductVariantCard";
import type { ProductCardItem } from "../types/productCard";

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

interface CatalogPageLayoutProps {
  title: string;
  subtitle?: string;
  items: ProductCardItem[];
  loading: boolean;
  emptyText: string;
  error?: string;
  initialStatusFilter?: StatusFilter;
}

export default function CatalogPageLayout({
  title,
  subtitle,
  items,
  loading,
  emptyText,
  error,
  initialStatusFilter = "all",
}: CatalogPageLayoutProps) {
  const [rarityFilter, setRarityFilter] = useState<RarityFilter>("all");
  const [boxFilter, setBoxFilter] = useState<BoxFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>(initialStatusFilter);
  const [sortOption, setSortOption] = useState<SortOption>("default");
  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);

  const filtersRef = useRef<HTMLDivElement | null>(null);

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

  return (
    <main className="search-page">
      <div className="search-page-header">
        <h1>{title}</h1>
        {subtitle && <p className="search-page-query">{subtitle}</p>}
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
      ) : error ? (
        <div className="search-empty-box">{error}</div>
      ) : filteredItems.length === 0 ? (
        <div className="search-empty-box">{emptyText}</div>
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
  );
}