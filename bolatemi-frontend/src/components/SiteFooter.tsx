import { Link } from "react-router-dom";

export default function SiteFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <div className="brand" style={{ marginBottom: 14 }}>
              <img src="/images/brand/logo.png" alt="Bolatemi Global and Sons" className="logo-mark" />
              <div className="brand-name" style={{ color: "#fff" }}>
                Bolatemi Global
                <span>Plumbing · Welding · Industrial</span>
              </div>
            </div>
            <p style={{ maxWidth: 280, color: "#8A97A1" }}>
              Your trusted partner for plumbing, welding &amp; industrial supplies — Agbara, Ogun State.
            </p>
          </div>
          <div>
            <h4>Shop</h4>
            <Link to="/shop">All Products</Link>
            <Link to="/shop?category=safety-wear">Safety Wear</Link>
            <Link to="/bulk-orders">Bulk Orders</Link>
          </div>
          <div>
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/request-a-quote">Request a Quote</Link>
            <Link to="/testimonials">Testimonials</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/admin">Admin Portal</Link>
          </div>
          <div>
            <h4>Legal</h4>
            <Link to="/legal/privacy-policy">Privacy Policy</Link>
            <Link to="/legal/terms">Terms &amp; Conditions</Link>
            <Link to="/legal/refund-policy">Refund Policy</Link>
            <Link to="/legal/delivery-policy">Delivery Policy</Link>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {new Date().getFullYear()} Bolatemi Global and Sons Enterprises</span>
          <span>Agbara, Ogun State, Nigeria</span>
        </div>
      </div>
    </footer>
  );
}
