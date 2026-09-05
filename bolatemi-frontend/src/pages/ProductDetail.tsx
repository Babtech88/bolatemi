import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api, formatNaira, whatsappLink } from "../lib/api";
import type { Product } from "../lib/types";
import { useCart } from "../context/CartContext";
import { useToast } from "../context/ToastContext";
import ProductCard from "../components/ProductCard";

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [showSticky, setShowSticky] = useState(false);
  const { addItem } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    setLoading(true);
    setActiveImage(0);
    setAdded(false);
    api
      .get<{ success: boolean; data: Product; related: Product[] }>(`/products/${slug}`)
      .then((res) => {
        setProduct(res.data);
        setRelated(res.related);
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    const onScroll = () => setShowSticky(window.scrollY > 420);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (loading) return <div className="loading-state">Loading product…</div>;
  if (!product) return <div className="empty-state">Product not found. <Link to="/shop">Back to shop</Link></div>;

  const isQuoteOnly = product.priceMode === "REQUEST_QUOTE";
  const waMessage = `Hello Bolatemi Global and Sons Enterprises, I am interested in ${product.name} (SKU ${product.sku}). Please send me the current price and availability.`;

  function handleAdd() {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    showToast(`${product.name} added to cart`);
  }

  return (
    <section className="section">
      <div className="wrap">
        <div className="breadcrumb">
          <Link to="/shop">Shop</Link> / <Link to={`/shop?category=${product.category.slug}`}>{product.category.name}</Link> / {product.name}
        </div>

        <div className="pd-grid">
          <div>
            <div className="pd-gallery-main">
              {product.images[activeImage] ? (
                <img src={product.images[activeImage].url} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3">
                  <rect x="3" y="3" width="18" height="18" rx="1" />
                  <path d="M3 16l5-5 4 4 5-6 4 5" />
                </svg>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="pd-thumbs">
                {product.images.map((img, i) => (
                  <button key={img.id} className={i === activeImage ? "active" : ""} onClick={() => setActiveImage(i)}>
                    <img src={img.url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div>
            <span className="pd-code">{product.sku} · {product.category.name}</span>
            <h1 style={{ fontSize: "clamp(24px,3vw,32px)" }}>{product.name}</h1>
            <div className="pd-price">
              {isQuoteOnly ? (
                <span>Request Current Price</span>
              ) : (
                <>
                  {product.discountPrice && <span className="old">{formatNaira(product.price)}</span>}
                  {formatNaira(product.discountPrice ?? product.price)}
                </>
              )}
            </div>

            <p style={{ color: "var(--ink-soft)", fontSize: 15, lineHeight: 1.7 }}>{product.description}</p>

            {(product.material || product.brand || product.size || product.specifications) && (
              <table className="spec-table">
                <tbody>
                  {product.brand && <tr><td>Brand</td><td>{product.brand}</td></tr>}
                  {product.material && <tr><td>Material</td><td>{product.material}</td></tr>}
                  {product.size && <tr><td>Size</td><td>{product.size}</td></tr>}
                  {product.specifications &&
                    Object.entries(product.specifications).map(([key, value]) => (
                      <tr key={key}><td>{key}</td><td>{value}</td></tr>
                    ))}
                  <tr><td>Availability</td><td>{product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : "Out of stock"}</td></tr>
                </tbody>
              </table>
            )}

            {!isQuoteOnly && (
              <div style={{ marginTop: 22 }}>
                <label className="mono" style={{ fontSize: 11, textTransform: "uppercase", color: "var(--ink-soft)", display: "block", marginBottom: 8 }}>Quantity</label>
                <div className="qty-input">
                  <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                  <input type="number" value={quantity} onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))} />
                  <button onClick={() => setQuantity((q) => q + 1)}>+</button>
                </div>
              </div>
            )}

            <div className="pd-actions">
              {isQuoteOnly ? (
                <Link to={`/request-a-quote?product=${encodeURIComponent(product.name)}`} className="btn btn-primary">Request Quote</Link>
              ) : (
                <>
                  <button
                    className="btn btn-primary"
                    disabled={product.stockQuantity === 0}
                    onClick={handleAdd}
                  >
                    {added ? "Added ✓" : "Add to Cart"}
                  </button>
                  <Link to="/checkout" onClick={handleAdd} className="btn btn-dark">Buy Now</Link>
                </>
              )}
              <a href={whatsappLink(waMessage)} target="_blank" rel="noreferrer" className="btn btn-outline-dark">Chat on WhatsApp</a>
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div style={{ marginTop: 72 }}>
            <div className="section-head"><h2 style={{ fontSize: 22 }}>Related Products</h2></div>
            <div className="product-grid">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>

      <div className={`sticky-cta-bar ${showSticky ? "visible" : ""}`}>
        <div>
          <div className="sticky-cta-price">
            {isQuoteOnly ? "Request Price" : (
              <>
                {product.discountPrice && <span className="old">{formatNaira(product.price)}</span>}
                {formatNaira(product.discountPrice ?? product.price)}
              </>
            )}
          </div>
        </div>
        {isQuoteOnly ? (
          <Link to={`/request-a-quote?product=${encodeURIComponent(product.name)}`} className="btn btn-primary btn-sm">Request Quote</Link>
        ) : (
          <button className="btn btn-primary btn-sm" disabled={product.stockQuantity === 0} onClick={handleAdd}>
            {added ? "Added ✓" : "Add to Cart"}
          </button>
        )}
      </div>
    </section>
  );
}
