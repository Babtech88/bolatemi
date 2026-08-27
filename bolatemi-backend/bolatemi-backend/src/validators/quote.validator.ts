import { z } from "zod";

// Treats an empty string as "not provided" for genuinely optional fields —
// browser forms naturally send "" for an untouched input, and without this
// z.string().optional() would still reject "" against a format check
// (email/url), even though the field was correctly left blank.
const optionalString = () => z.preprocess((v) => (v === "" ? undefined : v), z.string().optional());
const optionalEmail = () => z.preprocess((v) => (v === "" ? undefined : v), z.string().email().optional());
const optionalUrl = () => z.preprocess((v) => (v === "" ? undefined : v), z.string().url().optional());

export const createQuoteSchema = z.object({
  fullName: z.string().min(2),
  companyName: optionalString(),
  phone: z.string().min(7),
  email: optionalEmail(),
  whatsapp: optionalString(),
  productRequired: z.string().min(2),
  specification: optionalString(),
  quantity: optionalString(),
  deliveryLocation: optionalString(),
  message: optionalString(),
  attachmentUrl: optionalUrl(),
  isBulkOrder: z.boolean().optional(),
});

export const updateQuoteStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "QUOTED", "WON", "LOST"]).optional(),
  quotedPrice: z.number().positive().optional(),
});
