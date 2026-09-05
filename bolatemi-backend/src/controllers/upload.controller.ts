import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";

// Returns an absolute URL (not a relative path) since downstream consumers
// (the product schema's images[].url validator, and the frontend rendering
// <img src>) both expect a fully-qualified URL.
function absoluteUrl(req: Request, relativePath: string): string {
  return `${req.protocol}://${req.get("host")}${relativePath}`;
}

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.file) throw ApiError.badRequest("No file uploaded");
  const url = absoluteUrl(req, `/uploads/${req.file.filename}`);
  res.status(201).json({ success: true, data: { url } });
});

export const uploadImages = asyncHandler(async (req: Request, res: Response) => {
  const files = (req.files as Express.Multer.File[]) ?? [];
  if (!files.length) throw ApiError.badRequest("No files uploaded");
  const urls = files.map((f) => absoluteUrl(req, `/uploads/${f.filename}`));
  res.status(201).json({ success: true, data: urls.map((url) => ({ url })) });
});
