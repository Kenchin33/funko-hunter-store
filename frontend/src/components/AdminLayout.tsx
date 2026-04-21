import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

export default function AdminLayout({ title, children }: AdminLayoutProps) {
  const { logout } = useAuth();

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

        <button className="admin-logout-btn" onClick={logout}>
          Вийти
        </button>
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