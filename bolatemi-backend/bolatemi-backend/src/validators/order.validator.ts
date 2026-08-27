import { z } from "zod";

// See quote.validator.ts for why optional email needs this — an empty
// string from an untouched form field must be treated as "not provided",
// not as an invalid email address.
const optionalEmail = () => z.preprocess((v) => (v === "" ? undefined : v), z.string().email().optional());
const optionalString = () => z.preprocess((v) => (v === "" ? undefined : v), z.string().optional());

export const createOrderSchema = z.object({
  customer: z.object({
    fullName: z.string().min(2),
    phone: z.string().min(7),
    email: optionalEmail(),
    whatsapp: optionalString(),
    company: optionalString(),
  }),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
  deliveryAddress: z.string().min(5),
  deliveryCity: z.string().min(2),
  deliveryState: z.string().min(2),
  deliveryNotes: optionalString(),
});
