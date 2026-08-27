import { useEffect, useState } from "react";
import { api, formatNaira } from "../../lib/api";

interface Stats {
  totalSales: string;
  todaySales: string;
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  quoteRequests: number;
  totalCustomers: number;
  bestSellingProducts: { productId: string; name: string; unitsSold: number }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    api.get<{ success: boolean; data: Stats }>("/admin/dashboard", true).then((res) => setStats(res.data)).catch(() => {});
  }, []);

  if (!stats) return <div className="loading-state">Loading dashboard…</div>;

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 24 }}>Dashboard</h1>

      <div className="stat-grid">
        <div className="stat-card"><div className="label">Total Sales</div><div className="value">{formatNaira(stats.totalSales)}</div></div>
        <div className="stat-card"><div className="label">Today's Sales</div><div className="value">{formatNaira(stats.todaySales)}</div></div>
        <div className="stat-card"><div className="label">Total Orders</div><div className="value">{stats.totalOrders}</div></div>
        <div className="stat-card"><div className="label">Pending Orders</div><div className="value">{stats.pendingOrders}</div></div>
        <div className="stat-card"><div className="label">Completed Orders</div><div className="value">{stats.completedOrders}</div></div>
        <div className="stat-card"><div className="label">New Quote Requests</div><div className="value">{stats.quoteRequests}</div></div>
        <div className="stat-card"><div className="label">Total Customers</div><div className="value">{stats.totalCustomers}</div></div>
      </div>

      <h2 style={{ fontSize: 16, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.04em" }}>Best-Selling Products</h2>
      <table className="admin-table">
        <thead><tr><th>Product</th><th>Units Sold</th></tr></thead>
        <tbody>
          {stats.bestSellingProducts.length === 0 ? (
            <tr><td colSpan={2}>No sales yet.</td></tr>
          ) : (
            stats.bestSellingProducts.map((p) => <tr key={p.productId}><td>{p.name}</td><td>{p.unitsSold}</td></tr>)
          )}
        </tbody>
      </table>
    </div>
  );
}
