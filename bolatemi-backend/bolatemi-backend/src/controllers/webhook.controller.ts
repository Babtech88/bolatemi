import { Request, Response } from "express";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler";
import { env } from "../config/env";
import { confirmPayment } from "../services/order.service";
import { ApiError } from "../utils/ApiError";

// Paystack signs the raw request body with your secret key (HMAC SHA512) in
// the `x-paystack-signature` header. This is the reliable payment-confirmed
// signal in production — redirect-based verify() can be missed if the
// customer closes the tab before returning.
export const paystackWebhook = asyncHandler(async (req: Request, res: Response) => {
  const signature = req.headers["x-paystack-signature"] as string | undefined;
  const expected = crypto.createHmac("sha512", env.paystackSecretKey).update(req.body).digest("hex");

  // Constant-time comparison — a plain !== leaks timing information that
  // could theoretically help an attacker forge a valid signature byte by
  // byte. Buffers must be equal length for timingSafeEqual, so the length
  // check happens first (and short-circuits safely on a mismatched length).
  const signatureValid =
    Boolean(signature) &&
    signature!.length === expected.length &&
    crypto.timingSafeEqual(Buffer.from(signature!), Buffer.from(expected));

  if (!signatureValid) {
    throw ApiError.unauthorized("Invalid webhook signature");
  }

  const event = JSON.parse(req.body.toString("utf8"));

  if (event.event === "charge.success") {
    await confirmPayment(event.data.reference);
  }

  // Always 200 quickly — Paystack retries on non-2xx, we don't want retries
  // piling up for events we intentionally ignore.
  res.status(200).json({ received: true });
});
