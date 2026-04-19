import { useEffect, useMemo, useRef, useState } from "react";
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
type SortOption =
  | "default"
  | "price_asc"
  | "price_desc"
  | "name_asc"
  | "name_desc";

type OpenDropdown = null | "sort" | "rarity" | "box" | "status";

function labelForRarity(value: Exclude<RarityFilter, "all">) {
  if (value === "regular") return "Звичайна";
  if (value === "exclusive") return "Ексклюзив";
  return "Лімітка";
}

function labelForBox(value: Exclude<BoxFilter, "all">) {
  if (value === "normal") return "Ціла коробка";
  return "Пошкоджена коробка";
}

function labelForStatus(value: Exclude<StatusFilter, "all">) {
  if (value === "in_stock") return "В наявності";
  return "Передзамовлення";
}

function labelForSort(value: SortOption) {
  switch (value) {
    case "price_asc":
      return "Ціна: від дешевих";
    case "price_desc":
      return "Ціна: від дорогих";
    case "name_asc":
      return "Ім'я: A-Z";
    case "name_desc":
      return "Ім'я: Z-A";
    default:
      return "За замовчуванням";
  }
}

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q")?.trim() ?? "";

  const [items, setItems] = useState<ProductCardItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [rarityFilter, setRarityFilter] = useState<RarityFilter>("all");
  const [boxFilter, setBoxFilter] = useState<BoxFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("default");

  const [openDropdown, setOpenDropdown] = useState<OpenDropdown>(null);
  const filtersRef = useRef<HTMLDivElement | null>(null);

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

  function toggleDropdown(name: Exclude<OpenDropdown, null>) {
    setOpenDropdown((prev) => (prev === name ? null : name));
  }

  const activeFiltersCount =
    (rarityFilter !== "all" ? 1 : 0) +
    (boxFilter !== "all" ? 1 : 0) +
    (statusFilter !== "all" ? 1 : 0) +
    (sortOption !== "default" ? 1 : 0);

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
            <section className="search-toolbar" ref={filtersRef}>
              <div className="search-toolbar-top">
                <div className="search-toolbar-tabs">
                  <button className="search-toolbar-tab active">
                    Товари ({items.length})
                  </button>
                </div>

                <div className="search-toolbar-results">
                  ({filteredItems.length}) результатів
                </div>
              </div>

              <div className="search-toolbar-controls">
                <div className="filter-dropdown-wrap">
                  <button
                    className={`filter-trigger ${openDropdown === "sort" ? "open" : ""}`}
                    onClick={() => toggleDropdown("sort")}
                    type="button"
                  >
                    Сортування
                    <span className="filter-trigger-value">
                      {labelForSort(sortOption)}
                    </span>
                  </button>

                  {openDropdown === "sort" && (
                    <div className="filter-dropdown">
                      <button
                        className={`filter-option ${sortOption === "default" ? "selected" : ""}`}
                        onClick={() => {
                          setSortOption("default");
                          setOpenDropdown(null);
                        }}
                        type="button"
                      >
                        За замовчуванням
                      </button>
                      <button
                        className={`filter-option ${sortOption === "price_asc" ? "selected" : ""}`}
                        onClick={() => {
                          setSortOption("price_asc");
                          setOpenDropdown(null);
                        }}
                        type="button"
                      >
                        Ціна: від дешевих
                      </button>
                      <button
                        className={`filter-option ${sortOption === "price_desc" ? "selected" : ""}`}
                        onClick={() => {
                          setSortOption("price_desc");
                          setOpenDropdown(null);
                        }}
                        type="button"
                      >
                        Ціна: від дорогих
                      </button>
                      <button
                        className={`filter-option ${sortOption === "name_asc" ? "selected" : ""}`}
                        onClick={() => {
                          setSortOption("name_asc");
                          setOpenDropdown(null);
                        }}
                        type="button"
                      >
                        Ім'я: A-Z
                      </button>
                      <button
                        className={`filter-option ${sortOption === "name_desc" ? "selected" : ""}`}
                        onClick={() => {
                          setSortOption("name_desc");
                          setOpenDropdown(null);
                        }}
                        type="button"
                      >
                        Ім'я: Z-A
                      </button>
                    </div>
                  )}
                </div>

                <div className="filter-dropdown-wrap">
                  <button
                    className={`filter-trigger ${openDropdown === "rarity" ? "open" : ""}`}
                    onClick={() => toggleDropdown("rarity")}
                    type="button"
                  >
                    Рідкість
                    {rarityFilter !== "all" && (
                      <span className="filter-chip">
                        {labelForRarity(rarityFilter)}
                      </span>
                    )}
                  </button>

                  {openDropdown === "rarity" && (
                    <div className="filter-dropdown">
                      {rarityCounts.regular > 0 && (
                        <button
                          className={`filter-option ${rarityFilter === "regular" ? "selected" : ""}`}
                          onClick={() => {
                            setRarityFilter("regular");
                            setOpenDropdown(null);
                          }}
                          type="button"
                        >
                          <span>Звичайна</span>
                          <span className="filter-count">{rarityCounts.regular}</span>
                        </button>
                      )}

                      {rarityCounts.exclusive > 0 && (
                        <button
                          className={`filter-option ${rarityFilter === "exclusive" ? "selected" : ""}`}
                          onClick={() => {
                            setRarityFilter("exclusive");
                            setOpenDropdown(null);
                          }}
                          type="button"
                        >
                          <span>Ексклюзив</span>
                          <span className="filter-count">{rarityCounts.exclusive}</span>
                        </button>
                      )}

                      {rarityCounts.limited > 0 && (
                        <button
                          className={`filter-option ${rarityFilter === "limited" ? "selected" : ""}`}
                          onClick={() => {
                            setRarityFilter("limited");
                            setOpenDropdown(null);
                          }}
                          type="button"
                        >
                          <span>Лімітка</span>
                          <span className="filter-count">{rarityCounts.limited}</span>
                        </button>
                      )}

                      <button
                        className={`filter-option clear ${rarityFilter === "all" ? "selected" : ""}`}
                        onClick={() => {
                          setRarityFilter("all");
                          setOpenDropdown(null);
                        }}
                        type="button"
                      >
                        Скинути рідкість
                      </button>
                    </div>
                  )}
                </div>

                <div className="filter-dropdown-wrap">
                  <button
                    className={`filter-trigger ${openDropdown === "box" ? "open" : ""}`}
                    onClick={() => toggleDropdown("box")}
                    type="button"
                  >
                    Коробка
                    {boxFilter !== "all" && (
                      <span className="filter-chip">
                        {labelForBox(boxFilter)}
                      </span>
                    )}
                  </button>

                  {openDropdown === "box" && (
                    <div className="filter-dropdown">
                      {boxCounts.normal > 0 && (
                        <button
                          className={`filter-option ${boxFilter === "normal" ? "selected" : ""}`}
                          onClick={() => {
                            setBoxFilter("normal");
                            setOpenDropdown(null);
                          }}
                          type="button"
                        >
                          <span>Ціла коробка</span>
                          <span className="filter-count">{boxCounts.normal}</span>
                        </button>
                      )}

                      {boxCounts.damaged > 0 && (
                        <button
                          className={`filter-option ${boxFilter === "damaged" ? "selected" : ""}`}
                          onClick={() => {
                            setBoxFilter("damaged");
                            setOpenDropdown(null);
                          }}
                          type="button"
                        >
                          <span>Пошкоджена коробка</span>
                          <span className="filter-count">{boxCounts.damaged}</span>
                        </button>
                      )}

                      <button
                        className={`filter-option clear ${boxFilter === "all" ? "selected" : ""}`}
                        onClick={() => {
                          setBoxFilter("all");
                          setOpenDropdown(null);
                        }}
                        type="button"
                      >
                        Скинути коробку
                      </button>
                    </div>
                  )}
                </div>

                <div className="filter-dropdown-wrap">
                  <button
                    className={`filter-trigger ${openDropdown === "status" ? "open" : ""}`}
                    onClick={() => toggleDropdown("status")}
                    type="button"
                  >
                    Статус
                    {statusFilter !== "all" && (
                      <span className="filter-chip">
                        {labelForStatus(statusFilter)}
                      </span>
                    )}
                  </button>

                  {openDropdown === "status" && (
                    <div className="filter-dropdown">
                      {statusCounts.in_stock > 0 && (
                        <button
                          className={`filter-option ${statusFilter === "in_stock" ? "selected" : ""}`}
                          onClick={() => {
                            setStatusFilter("in_stock");
                            setOpenDropdown(null);
                          }}
                          type="button"
                        >
                          <span>В наявності</span>
                          <span className="filter-count">{statusCounts.in_stock}</span>
                        </button>
                      )}

                      {statusCounts.preorder > 0 && (
                        <button
                          className={`filter-option ${statusFilter === "preorder" ? "selected" : ""}`}
                          onClick={() => {
                            setStatusFilter("preorder");
                            setOpenDropdown(null);
                          }}
                          type="button"
                        >
                          <span>Передзамовлення</span>
                          <span className="filter-count">{statusCounts.preorder}</span>
                        </button>
                      )}

                      <button
                        className={`filter-option clear ${statusFilter === "all" ? "selected" : ""}`}
                        onClick={() => {
                          setStatusFilter("all");
                          setOpenDropdown(null);
                        }}
                        type="button"
                      >
                        Скинути статус
                      </button>
                    </div>
                  )}
                </div>

                <button
                  className={`filter-reset-inline ${activeFiltersCount === 0 ? "disabled" : ""}`}
                  onClick={resetFilters}
                  type="button"
                  disabled={activeFiltersCount === 0}
                >
                  Скинути ({activeFiltersCount})
                </button>
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