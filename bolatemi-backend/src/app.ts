import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { env } from "./config/env";
import routes from "./routes";
import webhookRoutes from "./routes/webhook.routes";
import { uploadDirPath } from "./middleware/upload";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export const app = express();

// CLIENT_URL supports a comma-separated list, so dev (Vite's default
// http://localhost:5173) and a deployed frontend domain can both be
// allowed without editing code — a mismatch here is a common cause of
// "Failed to fetch" in the browser, since a blocked CORS response looks
// identical to a network failure from fetch()'s perspective.
const allowedOrigins = Array.from(
  new Set([
    ...env.clientUrl.split(",").map((o) => o.trim()).filter(Boolean),
    "http://localhost:5173",
    "https://bolatemi-xaaw-chivercel.app",
  ])
);

app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      // No origin header (curl, server-to-server, some webhooks) — allow.
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS blocked: ${origin} is not in CLIENT_URL`));
    },
    credentials: true,
  })
);
app.use(cookieParser(env.cookieSecret));

// Webhooks need the raw request body to verify Paystack's HMAC signature,
// so this is mounted BEFORE express.json() — once json() runs, the raw
// body is gone and signature verification would always fail.
app.use("/api/webhooks", webhookRoutes);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.isProd ? "combined" : "dev"));

// Serve locally-uploaded product images. Points at the same path
// middleware/upload.ts resolved (/tmp/uploads on Vercel, UPLOAD_DIR
// elsewhere) — see the ephemeral-storage note there.
app.use("/uploads", express.static(uploadDirPath));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

// Same health check at both paths — /health for platforms that probe the
// bare domain (Render, Railway, uptime monitors), /api/health for anything
// that only reaches this app under an /api prefix (e.g. a Vercel deployment
// where the frontend's VITE_API_URL already ends in /api).
app.get("/api/health", (_req, res) => res.json({ status: "ok", env: env.nodeEnv }));

app.get("/favicon.ico", (_req, res) => {
  res.status(204).end();
});

app.use("/api", routes);

app.use(notFoundHandler);