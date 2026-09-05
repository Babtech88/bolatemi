import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../lib/api";
import { useToast } from "../context/ToastContext";

export default function QuoteForm({ isBulkOrder = false }: { isBulkOrder?: boolean }) {
  const [searchParams] = useSearchParams();
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "", companyName: "", phone: "", email: "", whatsapp: "",
    productRequired: searchParams.get("product") ?? "",
    specification: "", quantity: "", deliveryLocation: "", message: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      // Optional fields default to "" in form state so inputs stay controlled,
      // but the backend's email validator rejects "" as an invalid address
      // (only a missing field passes .optional()) — so blank optionals must
      // become undefined, not "", before they're sent.
      const payload = {
        ...form,
        email: form.email || undefined,
        companyName: form.companyName || undefined,
        whatsapp: form.whatsapp || undefined,
        specification: form.specification || undefined,
        quantity: form.quantity || undefined,
        deliveryLocation: form.deliveryLocation || undefined,
        message: form.message || undefined,
        isBulkOrder,
      };
      await api.post("/quotes", payload);
      setDone(true);
      showToast("Request submitted — our team will be in touch");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <div className="form-success">
        Thank you. Our sales team will contact you shortly.
      </div>
    );
  }

  return (
    <form onSubmit={submit} style={{ maxWidth: 640 }}>
      {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

      <div className="field-row">
        <div className="field"><label>Full Name *</label><input required value={form.fullName} onChange={(e) => update("fullName", e.target.value)} /></div>
        <div className="field"><label>Company Name</label><input value={form.companyName} onChange={(e) => update("companyName", e.target.value)} /></div>
      </div>
      <div className="field-row">
        <div className="field"><label>Phone *</label><input required value={form.phone} onChange={(e) => update("phone", e.target.value)} /></div>
        <div className="field"><label>WhatsApp Number</label><input value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} /></div>
      </div>
      <div className="field"><label>Email</label><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></div>
      <div className="field"><label>Product Required *</label><input required value={form.productRequired} onChange={(e) => update("productRequired", e.target.value)} /></div>
      <div className="field"><label>Product Specification</label><textarea rows={3} value={form.specification} onChange={(e) => update("specification", e.target.value)} placeholder="Size, thickness, diameter, material, standard, etc." /></div>
      <div className="field-row">
        <div className="field"><label>Quantity</label><input value={form.quantity} onChange={(e) => update("quantity", e.target.value)} /></div>
        <div className="field"><label>Delivery Location</label><input value={form.deliveryLocation} onChange={(e) => update("deliveryLocation", e.target.value)} /></div>
      </div>
      <div className="field"><label>Additional Message</label><textarea rows={4} value={form.message} onChange={(e) => update("message", e.target.value)} /></div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? "Submitting…" : isBulkOrder ? "Request Bulk Quote" : "Request a Quote"}
      </button>
    </form>
  );
}
