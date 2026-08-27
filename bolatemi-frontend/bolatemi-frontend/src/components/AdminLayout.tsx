import { Navigate, NavLink, Outlet } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const links = [
  { to: "/admin", label: "Dashboard", end: true },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/quotes", label: "Quotes" },
  { to: "/admin/testimonials", label: "Testimonials" },
  { to: "/admin/messages", label: "Messages" },
];

export default function AdminLayout() {
  const { admin, loading, logout } = useAdminAuth();

  if (loading) return <div className="loading-state">Loading…</div>;
  if (!admin) return <Navigate to="/admin/login" replace />;

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="brand" style={{ padding: "0 24px 24px" }}>
          <img src="/images/brand/logo.png" alt="Bolatemi Global and Sons" className="logo-mark" />
          <div className="brand-name">Admin<span>Bolatemi Global</span></div>
        </div>
        <nav>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}>{l.label}</NavLink>
          ))}
        </nav>
      </aside>
      <div className="admin-main">
        <div className="admin-topbar">
          <span className="mono" style={{ fontSize: 12, color: "var(--ink-soft)" }}>Signed in as {admin.name} ({admin.role})</span>
          <button className="btn btn-outline-dark btn-sm" onClick={logout}>Log Out</button>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
