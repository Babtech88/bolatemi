import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { api, formatNaira } from "../lib/api";

const NIGERIAN_STATES = [
  "Lagos", "Ogun", "Oyo", "Abuja (FCT)", "Rivers", "Kano", "Kaduna", "Delta", "Edo", "Enugu", "Other",
];

export default function Checkout() {
  const { items, subtotal } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "", phone: "", email: "", whatsapp: "", company: "",
    deliveryAddress: "", deliveryCity: "", deliveryState: "Lagos", deliveryNotes: "",
  });

  function update<K extends keyof typeof form>(key: K, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const res = await api.post<{ success: boolean; data: { checkoutUrl: string } }>("/orders", {
        customer: { fullName: form.fullName, phone: form.phone, email: form.email || undefined, whatsapp: form.whatsapp || undefined, company: form.company || undefined },
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
        deliveryAddress: form.deliveryAddress,
        deliveryCity: form.deliveryCity,
        deliveryState: form.deliveryState,
        deliveryNotes: form.deliveryNotes || undefined,
      });
      window.location.href = res.data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p>Your cart is empty — add products before checking out.</p>
        <Link to="/shop" className="btn btn-dark" style={{ marginTop: 16 }}>Browse Products</Link>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head"><h2>Checkout</h2></div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 48 }}>
          <form onSubmit={submit}>
            {error && <div className="form-error" style={{ marginBottom: 16 }}>{error}</div>}

            <h3 style={{ fontSize: 15, marginBottom: 16, textTransform: "uppercase", letterSpacing: "0.04em" }}>Customer Details</h3>
            <div className="field-row">
              <div className="field"><label>Full Name *</label><input required value={form.fullName} onChange={(e) => update("fullName", e.target.value)} /></div>
              <div className="field"><label>Phone *</label><input required value={form.phone} onChange={(e) => update("phone", e.target.value)} /></div>
            </div>
            <div className="field-row">
              <div className="field"><label>Email</label><input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></div>
              <div className="field"><label>Company (optional)</label><input value={form.company} onChange={(e) => update("company", e.target.value)} /></div>
            </div>

            <h3 style={{ fontSize: 15, margin: "28px 0 16px", textTransform: "uppercase", letterSpacing: "0.04em" }}>Delivery Information</h3>
            <div className="field"><label>Delivery Address *</label><input required value={form.deliveryAddress} onChange={(e) => update("deliveryAddress", e.target.value)} /></div>
            <div className="field-row">
              <div className="field"><label>City *</label><input required value={form.deliveryCity} onChange={(e) => update("deliveryCity", e.target.value)} /></div>
              <div className="field">
                <label>State *</label>
                <select required value={form.deliveryState} onChange={(e) => update("deliveryState", e.target.value)}>
                  {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="field"><label>Delivery Notes</label><textarea rows={3} value={form.deliveryNotes} onChange={(e) => update("deliveryNotes", e.target.value)} /></div>

            <button type="submit" className="btn btn-primary btn-block" disabled={submitting} style={{ marginTop: 8 }}>
              {submitting ? "Redirecting to payment…" : "Proceed to Payment"}
            </button>
            <p className="form-note" style={{ marginTop: 12 }}>You'll be redirected to Paystack to complete payment securely. Card details are never stored on our servers.</p>
          </form>

          <div className="cart-summary" style={{ height: "fit-content" }}>
            <h3 style={{ fontSize: 14, marginBottom: 14, textTransform: "uppercase", letterSpacing: "0.04em" }}>Order Summary</h3>
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="cart-summary-row">
                <span>{product.name} × {quantity}</span>
                <span className="mono">{formatNaira(Number(product.discountPrice ?? product.price ?? 0) * quantity)}</span>
              </div>
            ))}
            <div className="cart-summary-row total"><span>Total</span><span className="mono">{formatNaira(subtotal)}</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}
