import { useEffect, useState } from "react";
import { api, formatNaira } from "../../lib/api";

interface AdminOrder {
  id: string;
  orderNumber: string;
  status: string;
  total: string;
  createdAt: string;
  customer: { fullName: string; phone: string };
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  useEffect(() => {
    api.get<{ success: boolean; data: AdminOrder[] }>("/orders?limit=100", true).then((res) => setOrders(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 24 }}>Orders</h1>
      <table className="admin-table">
        <thead><tr><th>Order #</th><th>Customer</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td className="mono">{o.orderNumber}</td>
              <td>{o.customer?.fullName}<br /><span className="mono" style={{ fontSize: 11, color: "var(--ink-soft)" }}>{o.customer?.phone}</span></td>
              <td className="mono">{formatNaira(o.total)}</td>
              <td><span className={`status-pill status-${o.status.toLowerCase()}`}>{o.status}</span></td>
              <td className="mono" style={{ fontSize: 12 }}>{new Date(o.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
          {orders.length === 0 && <tr><td colSpan={5}>No orders yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
