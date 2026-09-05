import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { api, formatNaira } from "../lib/api";
import { useCart } from "../context/CartContext";

interface OrderResult {
  orderNumber: string;
  total: string;
  status: string;
}

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference") ?? searchParams.get("trxref") ?? "";
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [order, setOrder] = useState<OrderResult | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const { clear } = useCart();

  useEffect(() => {
    if (!reference) {
      setStatus("error");
      setErrorMsg("No payment reference found.");
      return;
    }
    api
      .get<{ success: boolean; data: OrderResult }>(`/orders/verify/${reference}`)
      .then((res) => {
        setOrder(res.data);
        setStatus("success");
        clear();
      })
      .catch((err) => {
        setStatus("error");
        setErrorMsg(err instanceof Error ? err.message : "Payment verification failed.");
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference]);

  if (status === "loading") return <div className="loading-state">Verifying payment…</div>;

  if (status === "error") {
    return (
      <div className="empty-state">
        <h2 style={{ marginBottom: 12, color: "var(--danger)" }}>Payment Failed</h2>
        <p>{errorMsg}</p>
        <Link to="/checkout" className="btn btn-dark" style={{ marginTop: 16 }}>Try Again</Link>
      </div>
    );
  }

  return (
    <div className="empty-state">
      <div className="success-check">
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
      </div>
      <h2 style={{ marginBottom: 12, color: "var(--success)" }}>Payment Successful</h2>
      <p>Order <strong className="mono">{order?.orderNumber}</strong> confirmed — total {formatNaira(order?.total)}.</p>
      <p style={{ marginTop: 8 }}>We'll be in touch with delivery details shortly. A receipt has been sent to your email.</p>
      <Link to="/shop" className="btn btn-dark" style={{ marginTop: 16 }}>Continue Shopping</Link>
    </div>
  );
}
