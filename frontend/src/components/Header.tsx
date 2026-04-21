import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { searchProductsLimited } from "../api/productApi";
import { useCart } from "../hooks/useCart";
import { useDebounce } from "../hooks/useDebounce";
import type { Product } from "../types/product";
import { mapProductsToCardItems } from "../utils/productCards";
import MiniCart from "./MiniCart";
import { CATEGORY_CONFIG } from "../config/catalog";
import { useAuth } from "../hooks/useAuth";

const menuItems = [
  {
    label: "Новинки",
    path: "/catalog/new",
  },
  {
    label: "Anime",
    categoryKey: "anime",
  },
  {
    label: "Heroes",
    categoryKey: "heroes",
  },
  {
    label: "Movies",
    categoryKey: "movies",
  },
  {
    label: "Games",
    categoryKey: "games",
  },
  {
    label: "Cartoons",
    categoryKey: "cartoons",
  },
  {
    label: "Books",
    categoryKey: "books",
  },
  {
    label: "Передзамовлення",
    path: "/catalog/preorder",
  },
] as const;

export default function Header() {
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const { isAuthenticated, user, logout } = useAuth();

  const cartRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const debouncedSearch = useDebounce(searchValue, 350);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement | null;

      if (target?.closest("[data-cart-action='add']")) {
        return;
      }

      if (cartRef.current && !cartRef.current.contains(target as Node)) {
        setCartOpen(false);
      }

      if (searchRef.current && !searchRef.current.contains(target as Node)) {
        setSearchOpen(false);
      }
    }

    function handleOpenCart() {
      setCartOpen(true);
    }

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("cart:open", handleOpenCart);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("cart:open", handleOpenCart);
    };
  }, []);

  useEffect(() => {
    async function runLiveSearch() {
      const trimmed = debouncedSearch.trim();

      if (trimmed.length < 2) {
        setSearchResults([]);
        setSearchOpen(false);
        return;
      }

      try {
        const data = await searchProductsLimited(trimmed);
        setSearchResults(data);
        setSearchOpen(true);
      } catch (error) {
        console.error("Live search failed:", error);
        setSearchResults([]);
        setSearchOpen(false);
      }
    }

    runLiveSearch();
  }, [debouncedSearch]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = searchValue.trim();
    if (!trimmed) return;

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    setSearchValue("");
    setSearchResults([]);
    setSearchOpen(false);
  }

  function handleResultClick() {
    setSearchValue("");
    setSearchResults([]);
    setSearchOpen(false);
  }

  const liveItems = mapProductsToCardItems(searchResults).slice(0, 3);

  return (
    <header className="store-header">
      <div className="store-header-top">
        <Link to="/" className="store-logo">
          <img src="/logo.png" alt="Funko Hunter" className="store-logo-image" />
        </Link>

        <nav className="store-nav">
          {menuItems.map((item) => (
            <div key={item.label} className="store-nav-item">
              {"path" in item ? (
                <Link to={item.path} className="store-nav-link">
                  {item.label}
                </Link>
              ) : (
                <>
                  <Link
                    to={`/catalog/${item.categoryKey}`}
                    className="store-nav-link"
                  >
                    {item.label}
                  </Link>

                  <div className="store-submenu">
                    {CATEGORY_CONFIG[item.categoryKey].subcategories.map((sub) => (
                      <Link
                        key={sub.slug}
                        to={`/catalog/${item.categoryKey}/${sub.slug}`}
                        className="store-submenu-link"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </nav>

        <div className="store-header-actions">
          <div className="store-search-box" ref={searchRef}>
            <form className="store-search-form" onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Пошук фігурок..."
                className="store-search-input"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => {
                  if (liveItems.length > 0) setSearchOpen(true);
                }}
              />
            </form>

            {searchOpen && liveItems.length > 0 && (
              <div className="live-search-dropdown">
                {liveItems.map((item) => (
                  <Link
                    key={`${item.productId}-${item.variantId}`}
                    to={`/product/${item.variantSlug}`}
                    className="live-search-item"
                    onClick={handleResultClick}
                  >
                    <div className="live-search-image-wrap">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.productName}
                          className="live-search-image"
                        />
                      ) : (
                        <div className="live-search-image-placeholder">No image</div>
                      )}
                    </div>

                    <div className="live-search-info">
                      <div className="live-search-title">{item.productName}</div>
                      <div className="live-search-meta">
                        {item.variantName}
                      </div>
                      <div className="live-search-price">
                        {item.price} грн
                      </div>
                    </div>
                  </Link>
                ))}

                <button
                  className="live-search-all-btn"
                  onClick={() => {
                    const trimmed = searchValue.trim();
                    if (!trimmed) return;

                    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
                    setSearchValue("");
                    setSearchResults([]);
                    setSearchOpen(false);
                  }}
                >
                  Показати всі результати
                </button>
              </div>
            )}
          </div>

          <div className="store-cart-wrap" ref={cartRef}>
            <button
              className="store-icon-btn store-cart-btn"
              aria-label="Кошик"
              onClick={() => setCartOpen((prev) => !prev)}
            >
              🛒
              {totalItems > 0 && (
                <span className="store-cart-count">{totalItems}</span>
              )}
            </button>

            {cartOpen && <MiniCart onClose={() => setCartOpen(false)} />}
          </div>

          <div className="store-account-box">
            {isAuthenticated ? (
              <div className="store-account-auth">
              {user?.is_admin && (
                <Link to="/admin/orders" className="store-account-admin-link">
                  Адмінка
                </Link>
              )}
            
              <Link to="/profile" className="store-account-name">
                {user?.first_name}
              </Link>
            
              <button className="store-account-logout" onClick={logout}>
                Вийти
              </button>
            </div>
            ) : (
              <Link to="/login" className="store-icon-btn" aria-label="Акаунт">
                👤
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}