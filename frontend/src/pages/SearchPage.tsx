import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { searchProducts } from "../api/productApi";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ProductVariantCard from "../components/ProductVariantCard";
import type { ProductCardItem } from "../types/productCard";
import { mapProductsToCardItems } from "../utils/productCards";

type RarityFilter = "all" | "regular" | "exclusive" | "limited";
type BoxFilter = "all" | "normal" | "damaged";
type StatusFilter = "all" | "in_stock" | "preorder";
type SortOption = "default" | "price_asc" | "price_desc";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  const [items, setItems] = useState<ProductCardItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [rarityFilter, setRarityFilter] = useState<RarityFilter>("all");
  const [boxFilter, setBoxFilter] = useState<BoxFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("default");

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

    return result;
  }, [items, rarityFilter, boxFilter, statusFilter, sortOption]);

  function resetFilters() {
    setRarityFilter("all");
    setBoxFilter("all");
    setStatusFilter("all");
    setSortOption("default");
  }

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
        ) : (
          <>
            <section className="search-filters">
              <div className="search-filters-grid">
                <div className="search-filter-group">
                  <label htmlFor="rarityFilter">Рідкість</label>
                  <select
                    id="rarityFilter"
                    value={rarityFilter}
                    onChange={(e) => setRarityFilter(e.target.value as RarityFilter)}
                  >
                    <option value="all">Усі</option>
                    <option value="regular">Звичайна</option>
                    <option value="exclusive">Ексклюзив</option>
                    <option value="limited">Лімітка</option>
                  </select>
                </div>

                <div className="search-filter-group">
                  <label htmlFor="boxFilter">Стан коробки</label>
                  <select
                    id="boxFilter"
                    value={boxFilter}
                    onChange={(e) => setBoxFilter(e.target.value as BoxFilter)}
                  >
                    <option value="all">Усі</option>
                    <option value="normal">Ціла</option>
                    <option value="damaged">Пошкоджена</option>
                  </select>
                </div>

                <div className="search-filter-group">
                  <label htmlFor="statusFilter">Статус</label>
                  <select
                    id="statusFilter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  >
                    <option value="all">Усі</option>
                    <option value="in_stock">В наявності</option>
                    <option value="preorder">Передзамовлення</option>
                  </select>
                </div>

                <div className="search-filter-group">
                  <label htmlFor="sortOption">Сортування</label>
                  <select
                    id="sortOption"
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                  >
                    <option value="default">За замовчуванням</option>
                    <option value="price_asc">Ціна: від дешевих</option>
                    <option value="price_desc">Ціна: від дорогих</option>
                  </select>
                </div>
              </div>

              <div className="search-filters-actions">
                <button className="search-reset-btn" onClick={resetFilters}>
                  Скинути фільтри
                </button>
                <span className="search-results-count">
                  Знайдено: <strong>{filteredItems.length}</strong>
                </span>
              </div>
            </section>

            {loading ? (
              <div className="store-loading">Пошук...</div>
            ) : filteredItems.length === 0 ? (
              <div className="search-empty-box">
                За вашим запитом і вибраними фільтрами нічого не знайдено.
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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}