import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

const SALT_ROUNDS = 12;

export async function login(email: string, password: string) {
  const normalizedEmail = email.trim().replace(/^.*<([^<>]+)>$/, "$1").trim().toLowerCase();
  const admin = await prisma.adminUser.findUnique({ where: { email: normalizedEmail } });
  if (!admin || !admin.isActive) throw ApiError.unauthorized("Invalid credentials");

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) throw ApiError.unauthorized("Invalid credentials");

  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { lastLoginAt: new Date() },
  });

  const token = jwt.sign(
    { id: admin.id, email: admin.email, role: admin.role },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn } as jwt.SignOptions
  );

  return {
    token,
    admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
  };
}


export async function changePassword(adminId: string, currentPassword: string, newPassword: string) {
  const admin = await prisma.adminUser.findUnique({ where: { id: adminId } });
  if (!admin || !admin.isActive) throw ApiError.unauthorized("Invalid or expired session");

  const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
  if (!valid) throw ApiError.badRequest("Current password is incorrect");

  const samePassword = await bcrypt.compare(newPassword, admin.passwordHash);
  if (samePassword) throw ApiError.badRequest("New password must be different from your current password");

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await prisma.adminUser.update({
    where: { id: admin.id },
    data: { passwordHash },
  });
}

// Only ever called from a seed script or by a SUPER_ADMIN creating staff
// accounts — never exposed as a public signup route.
export async function createAdmin(input: { name: string; email: string; password: string; role?: "SUPER_ADMIN" | "ADMIN" | "SALES" }) {
  const existing = await prisma.adminUser.findUnique({ where: { email: input.email } });
  if (existing) throw ApiError.conflict("An admin with this email already exists");

  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);
  const admin = await prisma.adminUser.create({
    data: {
      name: input.name,
      email: input.email,
      passwordHash,
      role: input.role ?? "ADMIN",
    },
  });

  return { id: admin.id, name: admin.name, email: admin.email, role: admin.role };
}
