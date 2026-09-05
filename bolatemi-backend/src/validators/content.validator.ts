import { z } from "zod";

const optionalString = () => z.preprocess((v) => (v === "" ? undefined : v), z.string().optional());
const optionalUrl = () => z.preprocess((v) => (v === "" ? undefined : v), z.string().url().optional());

export const createTestimonialSchema = z.object({
  name: z.string().min(2),
  company: optionalString(),
  review: z.string().min(5),
  rating: z.number().int().min(1).max(5),
  photoUrl: optionalUrl(),
});

export const createContactMessageSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: optionalString(),
  subject: optionalString(),
  message: z.string().min(5),
});
