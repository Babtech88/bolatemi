import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
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

const fallbackCategories: Category[] = [
  { id: "fb-1", name: "MS Pipes", slug: "ms-pipes" },
  { id: "fb-2", name: "Stainless Steel", slug: "stainless-steel" },
  { id: "fb-3", name: "Elbows & Tees", slug: "elbows-tees" },
  { id: "fb-4", name: "Flanges", slug: "flanges" },
  { id: "fb-5", name: "Water Pumps", slug: "water-pumps" },
  { id: "fb-6", name: "Plumbing Items", slug: "plumbing-items" },
  { id: "fb-7", name: "Safety Wear", slug: "safety-wear" },
  { id: "fb-8", name: "Safety Boots", slug: "safety-boots" },
  { id: "fb-9", name: "Electrical Components", slug: "electrical-components" },
  { id: "fb-10", name: "Water Heaters", slug: "water-heaters" },
  { id: "fb-11", name: "Structural Steel", slug: "structural-steel" },
  { id: "fb-12", name: "Valves", slug: "valves" },
  { id: "fb-13", name: "Steel Plates", slug: "steel-plates" },
  { id: "fb-14", name: "Bath & Sanitary Fittings", slug: "bath-sanitary-fittings" },
];

export default function SiteHeader() {
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(fallbackCategories);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    api
      .get<{ success: boolean; data: Category[] }>("/categories")
      .then((res) => {
        if (res.data && res.data.length > 0) setCategories(res.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    // Lock body scroll while the mobile drawer is open
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      <header className={scrolled ? "scrolled" : ""}>
        <div className="nav">
          <Link to="/" className="brand">
            <img src="/images/brand/logo.png" alt="Bolatemi Global and Sons" className="logo-mark" />
            <div className="brand-name">
              Bolatemi Global
              <span>Plumbing · Welding · Industrial</span>
            </div>
          </Link>

          <nav className="links">
            <div
              className="mega-trigger"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <NavLink to="/shop" className="mega-trigger-link">
                Products
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4"><path d="M6 9l6 6 6-6" /></svg>
              </NavLink>
              <div className={`mega-menu ${megaOpen ? "open" : ""}`}>
                <div className="mega-menu-grid">
                  {categories.slice(0, 12).map((cat) => (
                    <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="mega-menu-item" onClick={() => setMegaOpen(false)}>
                      <span className="mega-menu-thumb">
                        {categoryImages[cat.slug] && <img src={categoryImages[cat.slug]} alt="" />}
                      </span>
                      <span>{cat.name}</span>
                    </Link>
                  ))}
                </div>
                <Link to="/shop" className="mega-menu-viewall" onClick={() => setMegaOpen(false)}>
                  View All Products →
                </Link>
              </div>
            </div>
            <NavLink to="/bulk-orders">Bulk Orders</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            <NavLink to="/admin">Admin Portal</NavLink>
          </nav>

          <div className="nav-actions">
            <Link to="/admin" className="btn btn-outline-dark btn-sm admin-quick-link">Admin</Link>
            <Link to="/request-a-quote" className="btn btn-outline btn-sm nav-quote-btn">Request Quote</Link>
            <Link to="/cart" className="cart-btn" aria-label="Cart">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="9" cy="21" r="1.4" />
                <circle cx="18" cy="21" r="1.4" />
                <path d="M2 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L21 7H6" />
              </svg>
              {count > 0 && <span className="cart-badge">{count}</span>}
            </Link>
            <button className="hamburger-btn" aria-label="Open menu" onClick={() => setMobileOpen(true)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <div className="hazard" />

      <div className={`mobile-nav-overlay ${mobileOpen ? "open" : ""}`} onClick={() => setMobileOpen(false)} />
      <div className={`mobile-nav-panel ${mobileOpen ? "open" : ""}`}>
        <div className="mobile-nav-head">
          <div className="brand">
            <img src="/images/brand/logo.png" alt="Bolatemi Global and Sons" className="logo-mark" />
            <div className="brand-name">Bolatemi Global<span>Plumbing · Welding · Industrial</span></div>
          </div>
          <button className="mobile-nav-close" aria-label="Close menu" onClick={() => setMobileOpen(false)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="5" y1="5" x2="19" y2="19" /><line x1="19" y1="5" x2="5" y2="19" /></svg>
          </button>
        </div>
        <nav className="mobile-nav-links" onClick={() => setMobileOpen(false)}>
          <NavLink to="/shop">Shop Products</NavLink>
          <NavLink to="/bulk-orders">Bulk Orders</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/testimonials">Testimonials</NavLink>
          <NavLink to="/faq">FAQ</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          <NavLink to="/admin">Admin Portal</NavLink>
        </nav>
        <div className="mobile-nav-cats">
          <span className="mobile-nav-cats-label">Categories</span>
          <div className="mobile-nav-cats-grid" onClick={() => setMobileOpen(false)}>
            {categories.map((cat) => (
              <Link key={cat.id} to={`/shop?category=${cat.slug}`} className="mobile-nav-cat-chip">{cat.name}</Link>
            ))}
          </div>
        </div>
        <div className="mobile-nav-actions" onClick={() => setMobileOpen(false)}>
          <Link to="/request-a-quote" className="btn btn-primary btn-block">Request a Quote</Link>
          <Link to="/cart" className="btn btn-outline-dark btn-block">View Cart {count > 0 ? `(${count})` : ""}</Link>
        </div>
      </div>
    </>
  );
}
