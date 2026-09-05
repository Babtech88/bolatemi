import { Router, raw } from "express";
import { paystackWebhook } from "../controllers/webhook.controller";

const router = Router();

// Needs the raw body (not JSON-parsed) to verify the HMAC signature, so this
// route is mounted BEFORE express.json() in app.ts — see the comment there.
router.post("/paystack", raw({ type: "application/json" }), paystackWebhook);

export default router;
