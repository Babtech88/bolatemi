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


export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string().min(8, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "New passwords do not match",
  path: ["confirmPassword"],
});
