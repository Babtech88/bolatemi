import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import { env } from "./config/env";
import routes from "./routes";
import webhookRoutes from "./routes/webhook.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
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

// Serve locally-uploaded product images. On PaaS hosts with an ephemeral
// filesystem, swap the upload middleware for S3/Cloudinary and this line
// becomes unnecessary — see the note in middleware/upload.ts.
app.use("/uploads", express.static(path.join(process.cwd(), env.uploadDir)));

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

app.get("/health", (_req, res) => res.json({ status: "ok", env: env.nodeEnv }));

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);
