import { Router } from "express";
import * as quoteController from "../controllers/quote.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createQuoteSchema, updateQuoteStatusSchema } from "../validators/quote.validator";

const router = Router();

// Public — used by both "Request a Quote" and "Request Bulk Quote" forms
router.post("/", validate(createQuoteSchema), quoteController.createQuote);

// Admin — sales pipeline view
router.get("/", authenticate, authorize("SUPER_ADMIN", "ADMIN", "SALES"), quoteController.listQuotes);
router.patch("/:id", authenticate, authorize("SUPER_ADMIN", "ADMIN", "SALES"), validate(updateQuoteStatusSchema), quoteController.updateQuote);

export default router;
