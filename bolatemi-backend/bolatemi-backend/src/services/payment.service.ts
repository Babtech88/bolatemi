import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

const PAYSTACK_BASE = "https://api.paystack.co";

// Paystack expects amounts in kobo (NGN * 100).
export async function initializePaystackTransaction(params: { email: string; amountNaira: number; reference: string; metadata?: object }) {
  if (!env.paystackSecretKey) {
    throw ApiError.internal("Payment provider is not configured. Set PAYSTACK_SECRET_KEY.");
  }

  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.paystackSecretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amountNaira * 100),
      reference: params.reference,
      metadata: params.metadata ?? {},
      callback_url: `${env.clientUrl}/payment/callback`,
    }),
  });

  const data: any = await res.json();
  if (!res.ok || !data.status) {
    throw ApiError.badRequest(data.message ?? "Failed to initialize payment");
  }

  return data.data as { authorization_url: string; access_code: string; reference: string };
}

// Called after redirect AND ideally again via webhook — never trust the
// client-side redirect alone to mark an order paid.
export async function verifyPaystackTransaction(reference: string) {
  if (!env.paystackSecretKey) {
    throw ApiError.internal("Payment provider is not configured. Set PAYSTACK_SECRET_KEY.");
  }

  const res = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${env.paystackSecretKey}` },
  });

  const data: any = await res.json();
  if (!res.ok || !data.status) {
    throw ApiError.badRequest(data.message ?? "Failed to verify payment");
  }

  return data.data as { status: string; reference: string; amount: number; paid_at: string };
}
