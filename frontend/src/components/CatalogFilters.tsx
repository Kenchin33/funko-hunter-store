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

interface CatalogFiltersProps {
  totalItems: number;
  filteredCount: number;
  rarityFilter: RarityFilter;
  setRarityFilter: (value: RarityFilter) => void;
  boxFilter: BoxFilter;
  setBoxFilter: (value: BoxFilter) => void;
  statusFilter: StatusFilter;
  setStatusFilter: (value: StatusFilter) => void;
  sortOption: SortOption;
  setSortOption: (value: SortOption) => void;
  openDropdown: OpenDropdown;
  setOpenDropdown: (value: OpenDropdown) => void;
  rarityCounts: {
    regular: number;
    exclusive: number;
    limited: number;
  };
  boxCounts: {
    normal: number;
    damaged: number;
  };
  statusCounts: {
    in_stock: number;
    preorder: number;
  };
  resetFilters: () => void;
}

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

export default function CatalogFilters({
  totalItems,
  filteredCount,
  rarityFilter,
  setRarityFilter,
  boxFilter,
  setBoxFilter,
  statusFilter,
  setStatusFilter,
  sortOption,
  setSortOption,
  openDropdown,
  setOpenDropdown,
  rarityCounts,
  boxCounts,
  statusCounts,
  resetFilters,
}: CatalogFiltersProps) {
  const activeFiltersCount =
    (rarityFilter !== "all" ? 1 : 0) +
    (boxFilter !== "all" ? 1 : 0) +
    (statusFilter !== "all" ? 1 : 0) +
    (sortOption !== "default" ? 1 : 0);

  function toggleDropdown(name: Exclude<OpenDropdown, null>) {
    setOpenDropdown(openDropdown === name ? null : name);
  }

  return (
    <section className="search-toolbar">
      <div className="search-toolbar-top">
        <div className="search-toolbar-tabs">
          <button className="search-toolbar-tab active">
            Товари ({totalItems})
          </button>
        </div>

        <div className="search-toolbar-results">
          ({filteredCount}) результатів
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
            <span className="filter-trigger-value">{labelForSort(sortOption)}</span>
          </button>

          {openDropdown === "sort" && (
            <div className="filter-dropdown">
              {[
                ["default", "За замовчуванням"],
                ["price_asc", "Ціна: від дешевих"],
                ["price_desc", "Ціна: від дорогих"],
                ["name_asc", "Ім'я: A-Z"],
                ["name_desc", "Ім'я: Z-A"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  className={`filter-option ${sortOption === value ? "selected" : ""}`}
                  onClick={() => {
                    setSortOption(value as SortOption);
                    setOpenDropdown(null);
                  }}
                  type="button"
                >
                  {label}
                </button>
              ))}
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
              <span className="filter-chip">{labelForRarity(rarityFilter)}</span>
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
              <span className="filter-chip">{labelForBox(boxFilter)}</span>
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
              <span className="filter-chip">{labelForStatus(statusFilter)}</span>
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
  );
}