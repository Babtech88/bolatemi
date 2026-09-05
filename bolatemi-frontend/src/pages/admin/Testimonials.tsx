import { useEffect, useState } from "react";
import { api } from "../../lib/api";

interface AdminTestimonial {
  id: string;
  name: string;
  company?: string | null;
  review: string;
  rating: number;
  isApproved: boolean;
  createdAt: string;
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<AdminTestimonial[]>([]);

  function load() {
    api.get<{ success: boolean; data: AdminTestimonial[] }>("/testimonials/admin/all", true).then((res) => setTestimonials(res.data)).catch(() => {});
  }

  useEffect(load, []);

  async function setApproval(id: string, isApproved: boolean) {
    await api.patch(`/testimonials/${id}/approval`, { isApproved }, true);
    load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    await api.del(`/testimonials/${id}`, true);
    load();
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 24 }}>Testimonials</h1>
      <table className="admin-table">
        <thead><tr><th>Name</th><th>Company</th><th>Review</th><th>Rating</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {testimonials.map((t) => (
            <tr key={t.id}>
              <td>{t.name}</td>
              <td>{t.company ?? "—"}</td>
              <td style={{ maxWidth: 320 }}>{t.review}</td>
              <td>{"★".repeat(t.rating)}</td>
              <td><span className={`status-pill ${t.isApproved ? "status-paid" : "status-pending"}`}>{t.isApproved ? "Approved" : "Pending"}</span></td>
              <td style={{ display: "flex", gap: 10 }}>
                {!t.isApproved && <button className="btn btn-sm btn-dark" onClick={() => setApproval(t.id, true)}>Approve</button>}
                {t.isApproved && <button className="btn btn-sm btn-outline-dark" onClick={() => setApproval(t.id, false)}>Unpublish</button>}
                <button className="cart-remove" onClick={() => remove(t.id)}>Delete</button>
              </td>
            </tr>
          ))}
          {testimonials.length === 0 && <tr><td colSpan={6}>No testimonials submitted yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
