import { z } from "zod";

const normalizeMailboxEmail = (value: string) => {
  const trimmed = value.trim();
  const match = trimmed.match(/^.*<([^<>]+)>$/);
  return (match ? match[1] : trimmed).trim().toLowerCase();
};

export const loginSchema = z.object({
  email: z.string().transform(normalizeMailboxEmail).pipe(z.string().email()),
  password: z.string().min(8),
});

export const createAdminSchema = z.object({
  name: z.string().min(2),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "SALES"]).optional(),
});
