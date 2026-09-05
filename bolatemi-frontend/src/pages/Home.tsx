import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../lib/api";
import type { Category } from "../lib/types";

const categoryImages: Record<string, string> = {
  "ms-pipes": "/images/products/black_pipe.png",
  "stainless-steel": "/images/products/stainless_pipe.png",
  "elbows-tees": "/images/products/elbow.png",
  flanges: "/images/products/flange.png",
  "water-pumps": "/images/products/surface_pump.png",
  "plumbing-items": "/images/products/plumbing_material.png",
  "safety-wear": "/images/products/safety_jacket.png",
  "safety-boots": "/images/products/safety_boot.png",
  "electrical-components": "/images/products/schneider_contactor_1.jpg",
  "water-heaters": "/images/products/water_heaters.jpg",
  "structural-steel": "/images/products/steel_ibeam_1.jpg",
  valves: "/images/products/knife_gate_valves.jpg",
  "steel-plates": "/images/products/steel_plates_4x8x50.jpg",
  "bath-sanitary-fittings": "/images/products/vmac_double_bowl_sink.jpg",
};

// Shown immediately so the homepage never looks empty while the backend
// loads (or before it's connected at all) — replaced the instant the live
// /categories response comes back with real data.
const fallbackCategories: Category[] = [
  { id: "fallback-1", name: "MS Pipes", slug: "ms-pipes", code: "CAT-01", description: "Mild steel pipes in a range of diameters and thicknesses." },
  { id: "fallback-2", name: "Stainless Steel", slug: "stainless-steel", code: "CAT-02", description: "Corrosion-resistant stainless materials for industrial use." },
  { id: "fallback-3", name: "Elbows & Tees", slug: "elbows-tees", code: "CAT-03", description: "Plumbing and industrial fittings in standard specifications." },
  { id: "fallback-4", name: "Flanges", slug: "flanges", code: "CAT-04", description: "Weld-neck and slip-on flanges for pipe and vessel connections." },
  { id: "fallback-5", name: "Water Pumps", slug: "water-pumps", code: "CAT-05", description: "Pumps for residential, commercial and industrial supply." },
  { id: "fallback-6", name: "Plumbing Items", slug: "plumbing-items", code: "CAT-06", description: "General plumbing materials and installation accessories." },
  { id: "fallback-7", name: "Safety Wear", slug: "safety-wear", code: "CAT-07", description: "Helmets, gloves and protective clothing for site work." },
  { id: "fallback-8", name: "Safety Boots", slug: "safety-boots", code: "CAT-08", description: "Durable protective footwear for industrial environments." },
  { id: "fallback-9", name: "Electrical Components", slug: "electrical-components", code: "CAT-09", description: "Circuit breakers, contactors and motor starters for industrial electrical systems." },
  { id: "fallback-10", name: "Water Heaters", slug: "water-heaters", code: "CAT-10", description: "Electric water heaters for residential and commercial use." },
  { id: "fallback-11", name: "Structural Steel", slug: "structural-steel", code: "CAT-11", description: "I-beams and structural steel sections for construction." },
  { id: "fallback-12", name: "Valves", slug: "valves", code: "CAT-12", description: "Industrial valves for flow control in piping systems." },
  { id: "fallback-13", name: "Steel Plates", slug: "steel-plates", code: "CAT-13", description: "Mild steel plates and sheets for fabrication and construction." },
  { id: "fallback-14", name: "Bath & Sanitary Fittings", slug: "bath-sanitary-fittings", code: "CAT-14", description: "Taps, faucets, sinks, shower heads and bathroom accessories." },
];

// The full extracted stock range — shown as its own gallery so nothing
// from the source catalog is left out, even items that don't map neatly
// to a single category.
const productShowcase = [
  { name: "Black Pipe", img: "/images/products/black_pipe.png" },
  { name: "Stainless Pipe", img: "/images/products/stainless_pipe.png" },
  { name: "Galvanised Pipe", img: "/images/products/galvanised_pipe.png" },
  { name: "Elbow", img: "/images/products/elbow.png" },
  { name: "Tee", img: "/images/products/tee.png" },
  { name: "Flange", img: "/images/products/flange.png" },
  { name: "Safety Jacket", img: "/images/products/safety_jacket.png" },
  { name: "Safety Boot", img: "/images/products/safety_boot.png" },
  { name: "Bolt and Nuts", img: "/images/products/bolt_and_nuts.png" },
  { name: "Surface Pump", img: "/images/products/surface_pump.png" },
  { name: "Submersible Pump", img: "/images/products/submersible_pump.png" },
  { name: "Plumbing Material", img: "/images/products/plumbing_material.png" },
  { name: "Safety Helmet", img: "/images/products/safety_helmets_set.jpg" },
  { name: "Water Heater", img: "/images/products/water_heaters.jpg" },
  { name: "Structural I-Beam", img: "/images/products/steel_ibeam_1.jpg" },
  { name: "Steel Plate", img: "/images/products/steel_plates_4x8x50.jpg" },
  { name: "Knife Gate Valve", img: "/images/products/knife_gate_valves.jpg" },
  { name: "Electrical Contactor", img: "/images/products/schneider_contactor_1.jpg" },
  { name: "Circuit Breaker", img: "/images/products/schneider_mccb.jpg" },
  { name: "Kitchen Faucet", img: "/images/products/gold_pullout_kitchen_faucet.jpg" },
  { name: "Kitchen Sink", img: "/images/products/vmac_double_bowl_sink.jpg" },
  { name: "Shower Head", img: "/images/products/shower_heads_set.jpg" },
  { name: "Diesel Pump", img: "/images/products/capenda_diesel_pump.jpg" },
  { name: "Brass Bib Tap", img: "/images/products/brass_bib_taps.jpg" },
];

const heroSlides = productShowcase.map((p) => p.img);

function HeroBackgroundSlideshow() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActive((i) => (i + 1) % heroSlides.length), 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="hero-bg-slides">
        {heroSlides.map((src, i) => (
          <div
            key={src}
            className={`hero-bg-slide ${i === active ? "active" : ""}`}
            style={{ backgroundImage: `url(${src})` }}
          />
        ))}
      </div>
      <div className="hero-bg-scrim" />
    </>
  );
}

export default function Home() {
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);

  useEffect(() => {
    api
      .get<{ success: boolean; data: Category[] }>("/categories")
      .then((res) => {
        if (res.data && res.data.length > 0) setCategories(res.data);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <section className="home-hero">
        <HeroBackgroundSlideshow />
        <div className="wrap hero-content" style={{ padding: 0 }}>
          <span className="mono" style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 11.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--yellow)", border: "1px solid rgba(245,183,0,0.4)", padding: "6px 12px", marginBottom: 26 }}>
            Agbara · Ogun State · Nigeria — Serving Local &amp; Cross-Border Projects
          </span>
          <h1 style={{ fontSize: "clamp(34px,6vw,60px)", lineHeight: 1.04, maxWidth: 820, fontWeight: 700, textShadow: "0 2px 20px rgba(0,0,0,0.45)" }}>
            Quality Materials.<br />Reliable Supply.<br />Built for <span style={{ color: "var(--yellow)" }}>Excellence.</span>
          </h1>
          <p style={{ marginTop: 24, fontSize: 17, maxWidth: 560, color: "#C8CFD5" }}>
            Premium plumbing, welding and industrial supplies for contractors, engineers and businesses — MS pipes, stainless steel, flanges, pumps and safety equipment, in stock and ready to move.
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 38 }}>
            <Link to="/shop" className="btn btn-primary">Shop Products</Link>
            <Link to="/request-a-quote" className="btn btn-outline">Request a Quote</Link>
            <Link to="/contact" className="btn btn-outline">Chat on WhatsApp</Link>
          </div>
        </div>
      </section>

      <div className="badge-strip">
        <div className="wrap badge-strip-inner">
          <div className="badge-item">
            <span className="badge-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="8" r="6" /><path d="M8.5 13.5 7 22l5-3 5 3-1.5-8.5" /></svg>
            </span>
            <div><strong>Quality Assured</strong><span>We supply only the best</span></div>
          </div>
          <div className="badge-item">
            <span className="badge-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M3 16V6a1 1 0 0 1 1-1h9v11" /><path d="M13 9h4l4 4v3h-2" /><circle cx="7.5" cy="17.5" r="1.8" /><circle cx="17.5" cy="17.5" r="1.8" /></svg>
            </span>
            <div><strong>Reliable Delivery</strong><span>On time, every time</span></div>
          </div>
          <div className="badge-item">
            <span className="badge-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 15v-3a8 8 0 0 1 16 0v3" /><path d="M4 15a2 2 0 0 0 2 2h1v-5H5a1 1 0 0 0-1 1z" /><path d="M20 15a2 2 0 0 1-2 2h-1v-5h1a1 1 0 0 1 1 1z" /></svg>
            </span>
            <div><strong>Customer Satisfaction</strong><span>Your satisfaction is our priority</span></div>
          </div>
        </div>
      </div>

      <div className="trust">
        <div className="wrap trust-inner">
          <span>Quality Products</span>
          <span>Competitive Pricing</span>
          <span>Reliable Supply</span>
          <span>Professional Service</span>
          <span>Fast Response</span>
          <span>Trusted Industrial Supplier</span>
        </div>
      </div>

      <section className="section">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">Catalog</span>
            <h2>Product Categories</h2>
            <p>Everything you need for plumbing, welding and industrial projects — sourced, stocked and ready for pickup or delivery across Nigeria.</p>
          </div>
          <div className="cat-grid">
            {categories.map((cat) => (
              <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="cat-card">
                <div className="cat-card-img">
                  {categoryImages[cat.slug] ? (
                    <img src={categoryImages[cat.slug]} alt={cat.name} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--steel-mid)" }}>
                      <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="1" /></svg>
                    </div>
                  )}
                </div>
                <div className="cat-card-body">
                  <span className="cat-code">{cat.code ?? cat.slug.toUpperCase()}</span>
                  <h3>{cat.name}</h3>
                  <p>{cat.description}</p>
                  <span className="cat-link">View Products →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section showcase-section">
        <div className="wrap">
          <div className="section-head">
            <span className="kicker">Full Stock Range</span>
            <h2>Our Products</h2>
            <p>A closer look at what's on the shelf right now — from raw pipe to finished safety gear.</p>
          </div>
          <div className="showcase-grid">
            {productShowcase.map((p) => (
              <Link key={p.name} to={`/shop?search=${encodeURIComponent(p.name)}`} className="showcase-card">
                <img src={p.img} alt={p.name} />
                <span className="showcase-label">{p.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="why-wrap">
        <div className="wrap">
          <div className="section" style={{ paddingBottom: 0 }}>
            <div className="section-head" style={{ maxWidth: 520 }}>
              <span className="kicker" style={{ color: "var(--yellow)" }}>Why Bolatemi</span>
              <h2 style={{ color: "var(--white)" }}>Why Choose Us</h2>
            </div>
          </div>
        </div>
        <div className="why-grid">
          <div className="why-card"><div className="num">01</div><h3>Quality Products</h3><p>Reliable materials suitable for professional applications.</p></div>
          <div className="why-card"><div className="num">02</div><h3>Competitive Pricing</h3><p>Fair pricing for individuals, contractors and businesses.</p></div>
          <div className="why-card"><div className="num">03</div><h3>Wide Product Range</h3><p>Plumbing, welding, industrial and safety supplies, in one place.</p></div>
          <div className="why-card"><div className="num">04</div><h3>Professional Service</h3><p>Fast responses and knowledgeable product guidance.</p></div>
          <div className="why-card"><div className="num">05</div><h3>Reliable Supply</h3><p>Built for contractors, engineers and project managers.</p></div>
        </div>
      </div>

      <div className="bulk">
        <div className="wrap bulk-inner">
          <div>
            <h2>Need Materials in Bulk?</h2>
            <p>Get competitive pricing for wholesale, construction and industrial orders.</p>
          </div>
          <Link to="/bulk-orders" className="btn btn-dark">Request Bulk Quote</Link>
        </div>
      </div>

      <div className="loc">
        <div className="wrap loc-inner">
          <div className="loc-addr">
            <strong>Visit the Warehouse</strong>
            Bolatemi Global and Sons Enterprises<br />
            KM 15/16, Lusada–Atan Expressway<br />
            Agbara, Ogun State, Nigeria
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="btn btn-dark btn-sm">Get Directions</a>
            <Link to="/contact" className="btn btn-outline-dark btn-sm">Call Us</Link>
          </div>
        </div>
      </div>
    </>
  );
}
