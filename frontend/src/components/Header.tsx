import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MiniCart from "./MiniCart";
import { useCart } from "../hooks/useCart";

const menuItems = [
  {
    label: "Новинки",
    path: "/new",
  },
  {
    label: "Anime",
    children: ["One Piece", "Naruto", "Jujutsu Kaisen", "Demon Slayer", "My Hero Academia", "Chainsaw Man", "Інші"],
  },
  {
    label: "Heroes",
    children: ["Marvel", "DC"],
  },
  {
    label: "Movies",
    children: ["Harry Potter", "Star Wars", "Lord of the Rings", "Sopranos", "Інші"],
  },
  {
    label: "Games",
    children: ["PlayStation", "Dota 2", "FNAF", "League of Legends", "World of Warcraft", "Інші"],
  },
  {
    label: "Cartoons",
    children: ["Disney", "Pixar", "Avatar the Last Airbender", "Arcane", "Sponge Bob", "Інші"],
  },
  {
    label: "Передзамовлення",
    path: "/preorder",
  },
];

export default function Header() {
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const cartRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement | null;

      if (target?.closest("[data-cart-action='add']")) {
        return;
      }

      if (cartRef.current && !cartRef.current.contains(target as Node)) {
        setCartOpen(false);
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

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();

    const trimmed = searchValue.trim();
    if (!trimmed) return;

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <header className="store-header">
      <div className="store-header-top">
        <Link to="/" className="store-logo">
          <img src="/logo.png" alt="Funko Hunter" className="store-logo-image" />
        </Link>

        <nav className="store-nav">
          {menuItems.map((item) => (
            <div key={item.label} className="store-nav-item">
              {item.path ? (
                <Link to={item.path} className="store-nav-link">
                  {item.label}
                </Link>
              ) : (
                <>
                  <button className="store-nav-link store-nav-button">
                    {item.label}
                  </button>

                  <div className="store-submenu">
                    {item.children?.map((child) => (
                      <button key={child} className="store-submenu-link">
                        {child}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </nav>

        <div className="store-header-actions">
          <form className="store-search-form" onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="Пошук фігурок..."
              className="store-search-input"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </form>

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

          <button className="store-icon-btn" aria-label="Акаунт">
            👤
          </button>
        </div>
      </div>
    </header>
  );
}