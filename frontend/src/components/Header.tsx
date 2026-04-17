import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

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
  return (
    <header className="store-header">
      <div className="store-header-top">
        <Link to="/" className="store-logo">
          <img src={logo} alt="Funko Hunter" className="store-logo-image" />
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
          <input
            type="text"
            placeholder="Пошук фігурок..."
            className="store-search-input"
          />

          <button className="store-icon-btn" aria-label="Кошик">
            🛒
          </button>

          <button className="store-icon-btn" aria-label="Акаунт">
            👤
          </button>
        </div>
      </div>
    </header>
  );
}