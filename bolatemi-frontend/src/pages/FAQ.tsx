const faqs = [
  { q: "What areas do you deliver to?", a: "We deliver across Nigeria from our warehouse in Agbara, Ogun State. Delivery fees and timelines depend on your location." },
  { q: "Can I get a price for large or custom orders?", a: "Yes — use the Request a Quote or Bulk Orders page and our sales team will get back to you with current pricing." },
  { q: "What payment methods do you accept?", a: "Card, bank transfer and USSD, all processed securely through Paystack. We never store your card details." },
  { q: "Can I visit the warehouse in person?", a: "Yes, walk-ins are welcome at KM 15/16, Lusada–Atan Expressway, Agbara, Ogun State during business hours." },
];

export default function FAQ() {
  return (
    <>
      <div className="page-hero">
        <div className="wrap" style={{ padding: 0 }}>
          <h1>Frequently Asked Questions</h1>
        </div>
      </div>
      <section className="section">
        <div className="wrap" style={{ maxWidth: 720 }}>
          {faqs.map((f) => (
            <div key={f.q} style={{ borderBottom: "1px solid #D7D1C2", padding: "20px 0" }}>
              <h3 style={{ fontSize: 15, textTransform: "none", letterSpacing: 0, marginBottom: 8 }}>{f.q}</h3>
              <p style={{ color: "var(--ink-soft)", fontSize: 14 }}>{f.a}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
