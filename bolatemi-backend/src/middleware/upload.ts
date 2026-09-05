import multer from "multer";
import path from "path";
import fs from "fs";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

// Vercel's serverless filesystem is READ-ONLY everywhere except /tmp — a
// startup crash here (e.g. from mkdirSync against a read-only path) takes
// down every route, not just uploads, since this module sits on the
// import chain the whole Express app loads at cold start. VERCEL is a
// platform-provided env var, always "1" when running there.
const isServerless = Boolean(process.env.VERCEL);
const uploadPath = isServerless ? "/tmp/uploads" : path.join(process.cwd(), env.uploadDir);

try {
  if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
} catch (err) {
  // Never let a filesystem hiccup at import time crash the whole API —
  // worst case, uploads fail with a clear error when actually attempted,
  // instead of silently killing every unrelated route.
  console.error("[upload] Could not create upload directory:", err);
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadPath),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    cb(null, `${unique}${ext}`);
  },
});

const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export const upload = multer({
  storage,
  limits: { fileSize: env.maxUploadMb * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!allowedTypes.has(file.mimetype)) {
      return cb(new ApiError(400, "Only JPEG, PNG, WEBP or AVIF images are allowed") as any);
    }
    cb(null, true);
  },
});

export const uploadDirPath = uploadPath;

// NOTE: on Vercel (and any serverless host), /tmp is EPHEMERAL — it can be
// wiped between invocations and is never shared across the multiple
// server instances Vercel may run concurrently. Uploaded images will
// often just vanish. This makes uploads "not crash" on Vercel, not
// "actually work reliably" on Vercel. Before relying on product-image
// uploads in production there, swap this for Cloudinary/S3 — the
// controller/route shape stays identical, only this file changes.
// On a VPS or Render/Railway with a persistent disk, the original
// behavior (writing to UPLOAD_DIR) still applies and works normally.
