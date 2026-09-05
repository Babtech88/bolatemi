import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError";
import { env } from "../config/env";

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
}

// Centralized error handler — every route funnels errors here via
// asyncHandler/next(err), so this is the single place that shapes API
// error responses and decides what's safe to expose to the client.
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details ? { details: err.details } : {}),
    });
  }

  // Prisma known errors (unique constraint, not found, etc.) get a generic
  // 400 rather than leaking internals; log server-side for diagnosis.
  console.error("[unhandled error]", err);

  return res.status(500).json({
    success: false,
    message: env.isProd ? "Something went wrong" : String(err instanceof Error ? err.message : err),
  });
}
