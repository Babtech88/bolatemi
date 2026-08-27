import { useEffect, useState } from "react";
import { api } from "../../lib/api";

interface AdminQuote {
  id: string;
  fullName: string;
  phone: string;
  productRequired: string;
  quantity?: string;
  status: string;
  isBulkOrder: boolean;
  createdAt: string;
}

const STATUSES = ["NEW", "CONTACTED", "QUOTED", "WON", "LOST"];

export default function AdminQuotes() {
  const [quotes, setQuotes] = useState<AdminQuote[]>([]);

  function load() {
    api.get<{ success: boolean; data: AdminQuote[] }>("/quotes?limit=100", true).then((res) => setQuotes(res.data)).catch(() => {});
  }

  useEffect(load, []);

  async function updateStatus(id: string, status: string) {
    await api.patch(`/quotes/${id}`, { status }, true);
    load();
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 24 }}>Quotes &amp; Bulk Orders</h1>
      <table className="admin-table">
        <thead><tr><th>Name</th><th>Phone</th><th>Product</th><th>Type</th><th>Status</th><th>Date</th></tr></thead>
        <tbody>
          {quotes.map((q) => (
            <tr key={q.id}>
              <td>{q.fullName}</td>
              <td className="mono">{q.phone}</td>
              <td>{q.productRequired}{q.quantity ? ` (${q.quantity})` : ""}</td>
              <td>{q.isBulkOrder ? "Bulk" : "Quote"}</td>
              <td>
                <select value={q.status} onChange={(e) => updateStatus(q.id, e.target.value)} style={{ padding: "4px 8px", fontSize: 12 }}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
              <td className="mono" style={{ fontSize: 12 }}>{new Date(q.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
          {quotes.length === 0 && <tr><td colSpan={6}>No quote requests yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
