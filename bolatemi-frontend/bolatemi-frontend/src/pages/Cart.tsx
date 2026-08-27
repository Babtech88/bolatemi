import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { formatNaira } from "../lib/api";

export default function Cart() {
  const { items, removeItem, setQuantity, subtotal } = useCart();

  if (items.length === 0) {
    return (
      <div className="empty-state">
        <svg width="46" height="46" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" style={{ color: "var(--steel-mid)", margin: "0 auto 16px" }}>
          <circle cx="9" cy="21" r="1.4" /><circle cx="18" cy="21" r="1.4" />
          <path d="M2 3h2l2.4 12.2a2 2 0 0 0 2 1.6h8.6a2 2 0 0 0 2-1.6L21 7H6" />
        </svg>
        <p>Your cart is empty.</p>
        <Link to="/shop" className="btn btn-dark" style={{ marginTop: 16 }}>Browse Products</Link>
      </div>
    );
  }

  return (
    <section className="section">
      <div className="wrap">
        <div className="section-head"><h2>Your Cart</h2></div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 40 }}>
          <table className="cart-table">
            <thead>
              <tr><th>Product</th><th>Price</th><th>Qty</th><th>Total</th><th></th></tr>
            </thead>
            <tbody>
              {items.map(({ product, quantity }) => {
                const unit = Number(product.discountPrice ?? product.price ?? 0);
                return (
                  <tr key={product.id}>
                    <td>
                      <div className="cart-row-name">{product.name}</div>
                      <div className="cart-row-sku">{product.sku}</div>
                    </td>
                    <td className="mono">{formatNaira(unit)}</td>
                    <td>
                      <div className="qty-input">
                        <button onClick={() => setQuantity(product.id, quantity - 1)}>−</button>
                        <input type="number" value={quantity} onChange={(e) => setQuantity(product.id, Number(e.target.value))} />
                        <button onClick={() => setQuantity(product.id, quantity + 1)}>+</button>
                      </div>
                    </td>
                    <td className="mono">{formatNaira(unit * quantity)}</td>
                    <td><button className="cart-remove" onClick={() => removeItem(product.id)}>Remove</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="cart-summary">
            <div className="cart-summary-row"><span>Subtotal</span><span className="mono">{formatNaira(subtotal)}</span></div>
            <div className="cart-summary-row"><span>Delivery</span><span className="mono">Calculated at checkout</span></div>
            <div className="cart-summary-row total"><span>Total</span><span className="mono">{formatNaira(subtotal)}</span></div>
            <Link to="/checkout" className="btn btn-primary btn-block" style={{ marginTop: 18 }}>Proceed to Checkout</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
