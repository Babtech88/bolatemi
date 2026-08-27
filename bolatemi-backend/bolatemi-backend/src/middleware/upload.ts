import multer from "multer";
import path from "path";
import fs from "fs";
import { env } from "../config/env";
import { ApiError } from "../utils/ApiError";

const uploadPath = path.join(process.cwd(), env.uploadDir);
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

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

// NOTE: this stores files on local disk, which works for a single VPS
// deployment but NOT for Render/Railway/most PaaS hosts, where the
// filesystem is ephemeral and wiped on every redeploy. Before deploying to
// one of those, swap this for an S3-compatible bucket (e.g. Cloudinary,
// AWS S3, Backblaze) — the route/controller shape below stays the same,
// only this file changes.
