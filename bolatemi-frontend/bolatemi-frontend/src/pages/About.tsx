export default function About() {
  return (
    <>
      <div className="page-hero">
        <div className="wrap" style={{ padding: 0 }}>
          <h1>About Bolatemi Global and Sons</h1>
          <p>Built to supply Nigeria's builders — plumbing, welding and industrial materials, done right.</p>
        </div>
      </div>
      <section className="section">
        <div className="wrap" style={{ maxWidth: 760 }}>
          <p style={{ fontSize: 15.5, color: "var(--ink-soft)", marginBottom: 16, lineHeight: 1.8 }}>
            Bolatemi Global and Sons Enterprises specializes in supplying plumbing, welding, stainless steel,
            industrial and safety products to contractors, engineers and businesses across Nigeria.
          </p>
          <p style={{ fontSize: 15.5, color: "var(--ink-soft)", marginBottom: 16, lineHeight: 1.8 }}>
            We focus on the fundamentals that keep projects on schedule: quality materials, reliable stock,
            competitive pricing and dependable, professional service.
          </p>
          <ul style={{ marginTop: 24, display: "grid", gap: 10 }}>
            {["Quality-checked materials", "Stock built for contractor turnaround", "Direct sales support, no middlemen delays"].map((item) => (
              <li key={item} className="mono" style={{ fontSize: 13, display: "flex", gap: 10 }}>
                <span style={{ color: "var(--orange)" }}>//</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
