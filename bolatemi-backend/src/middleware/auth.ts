import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Role } from "@prisma/client";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}

// Verifies the admin JWT (from Authorization header or httpOnly cookie)
// and attaches the decoded admin to req.admin for downstream handlers.
export function authenticate(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    const bearerToken = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
    const token = bearerToken ?? req.cookies?.token;

    if (!token) throw ApiError.unauthorized("Authentication required");

    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
    req.admin = payload;
    next();
  } catch {
    next(ApiError.unauthorized("Invalid or expired session"));
  }
}

// Restricts a route to specific admin roles, e.g. authorize("SUPER_ADMIN")
export function authorize(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.admin) return next(ApiError.unauthorized());
    if (!roles.includes(req.admin.role)) return next(ApiError.forbidden("Insufficient permissions"));
    next();
  };
}
