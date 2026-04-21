import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function AdminLayout({ title, children }: AdminLayoutProps) {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-brand">Funko Hunter Admin</div>

        <nav className="admin-sidebar-nav">
          <Link to="/admin/orders" className="admin-sidebar-link">
            Замовлення
          </Link>
          <Link to="/admin/products" className="admin-sidebar-link">
            Товари
          </Link>
          <Link to="/admin/complaints" className="admin-sidebar-link">
            Скарги
          </Link>
        </nav>

        <div className="admin-sidebar-footer">
          <button
            className="admin-home-btn"
            onClick={() => navigate("/")}
          >
            ← На головну
          </button>
        </div>
      </aside>

      <main className="admin-content">
        <div className="admin-content-header">
          <h1>{title}</h1>
        </div>

        <div className="admin-content-body">{children}</div>
      </main>
    </div>
  );
}