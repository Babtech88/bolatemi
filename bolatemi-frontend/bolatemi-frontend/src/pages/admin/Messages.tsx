import { useEffect, useState } from "react";
import { api } from "../../lib/api";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  function load() {
    api.get<{ success: boolean; data: ContactMessage[] }>("/contact", true).then((res) => setMessages(res.data)).catch(() => {});
  }

  useEffect(load, []);

  async function markRead(id: string) {
    await api.patch(`/contact/${id}/read`, {}, true);
    load();
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, marginBottom: 24 }}>Contact Messages</h1>
      <table className="admin-table">
        <thead><tr><th>From</th><th>Subject</th><th>Message</th><th>Status</th><th>Date</th><th></th></tr></thead>
        <tbody>
          {messages.map((m) => (
            <tr key={m.id}>
              <td>{m.name}<br /><span className="mono" style={{ fontSize: 11, color: "var(--ink-soft)" }}>{m.email}</span></td>
              <td>{m.subject ?? "—"}</td>
              <td style={{ maxWidth: 320 }}>{m.message}</td>
              <td><span className={`status-pill ${m.isRead ? "status-paid" : "status-pending"}`}>{m.isRead ? "Read" : "Unread"}</span></td>
              <td className="mono" style={{ fontSize: 12 }}>{new Date(m.createdAt).toLocaleDateString()}</td>
              <td>{!m.isRead && <button className="btn btn-sm btn-outline-dark" onClick={() => markRead(m.id)}>Mark Read</button>}</td>
            </tr>
          ))}
          {messages.length === 0 && <tr><td colSpan={6}>No messages yet.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}
