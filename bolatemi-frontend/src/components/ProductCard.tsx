import { Link } from "react-router-dom";
import type { Product } from "../lib/types";
import { formatNaira } from "../lib/api";

export default function ProductCard({ product }: { product: Product }) {
  const stockLabel = product.stockQuantity === 0 ? "out" : product.stockQuantity <= 5 ? "low" : "in";
  const stockText = product.stockQuantity === 0 ? "Out of Stock" : product.stockQuantity <= 5 ? "Low Stock" : "In Stock";

  return (
    <Link to={`/shop/${product.slug}`} className="product-card">
      <div className="product-card-img">
        {product.images[0] ? (
          <img src={product.images[0].url} alt={product.images[0].altText ?? product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="1" />
            <path d="M3 16l5-5 4 4 5-6 4 5" />
          </svg>
        )}
        {product.priceMode === "FIXED" && <span className={`stock-badge ${stockLabel}`}>{stockText}</span>}
      </div>
      <div className="product-card-body">
        <span className="product-sku">{product.sku}</span>
        <h3>{product.name}</h3>
        <div className="product-price">
          {product.priceMode === "REQUEST_QUOTE" ? (
            <span>Request Price</span>
          ) : (
            <>
              {product.discountPrice && <span className="old">{formatNaira(product.price)}</span>}
              {formatNaira(product.discountPrice ?? product.price)}
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
