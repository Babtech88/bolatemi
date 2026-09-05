import { useState } from "react";
import { api } from "../lib/api";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await api.post("/contact", form);
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="page-hero">
        <div className="wrap" style={{ padding: 0 }}>
          <h1>Contact Us</h1>
          <p>Bolatemi Global and Sons Enterprises — KM 15/16, Lusada–Atan Expressway, Agbara, Ogun State, Nigeria</p>
        </div>
      </div>

      <section className="section">
        <div className="wrap" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 56 }}>
          <div>
            <h3 style={{ fontSize: 15, marginBottom: 18, textTransform: "uppercase", letterSpacing: "0.04em" }}>Get in Touch</h3>
            <table className="spec-table">
              <tbody>
                <tr><td>Phone</td><td>Available on request — set in admin settings</td></tr>
                <tr><td>WhatsApp</td><td>Use the floating WhatsApp button</td></tr>
                <tr><td>Email</td><td>Bolatemiglobalandsonsenterprises@gmail.com</td></tr>
                <tr><td>Business Hours</td><td>Mon–Sat, 8:00 AM – 6:00 PM</td></tr>
              </tbody>
            </table>
          </div>

          <form onSubmit={submit}>
            {done && <div className="form-success">Thank you for reaching out — we'll respond shortly.</div>}
            {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}
            {!done && (
              <>
                <div className="field-row">
                  <div className="field"><label>Name *</label><input required value={form.name} onChange={(e) => update("name", e.target.value)} /></div>
                  <div className="field"><label>Email *</label><input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></div>
                </div>
                <div className="field-row">
                  <div className="field"><label>Phone</label><input value={form.phone} onChange={(e) => update("phone", e.target.value)} /></div>
                  <div className="field"><label>Subject</label><input value={form.subject} onChange={(e) => update("subject", e.target.value)} /></div>
                </div>
                <div className="field"><label>Message *</label><textarea required rows={5} value={form.message} onChange={(e) => update("message", e.target.value)} /></div>
                <button type="submit" className="btn btn-primary" disabled={submitting}>{submitting ? "Sending…" : "Send Message"}</button>
              </>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
