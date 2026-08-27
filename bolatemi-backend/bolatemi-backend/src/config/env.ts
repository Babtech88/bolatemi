import dotenv from "dotenv";
dotenv.config();

function required(name: string, fallback?: string): string {
  const val = process.env[name] ?? fallback;
  if (val === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return val;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parseInt(process.env.PORT ?? "5000", 10),
  clientUrl: process.env.CLIENT_URL ?? "http://localhost:3000",

  jwtSecret: required("JWT_SECRET", "dev_only_insecure_secret_change_me"),
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  cookieSecret: required("COOKIE_SECRET", "dev_only_insecure_secret_change_me"),

  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY ?? "",
  paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY ?? "",

  smtp: {
    host: process.env.SMTP_HOST ?? "",
    port: parseInt(process.env.SMTP_PORT ?? "587", 10),
    user: process.env.SMTP_USER ?? "",
    pass: process.env.SMTP_PASS ?? "",
    from: process.env.SMTP_FROM ?? "Bolatemi Global and Sons <sales@bolatemiglobal.com>",
  },

  whatsappNumber: process.env.WHATSAPP_NUMBER ?? "",

  uploadDir: process.env.UPLOAD_DIR ?? "uploads",
  maxUploadMb: parseInt(process.env.MAX_UPLOAD_MB ?? "5", 10),

  isProd: (process.env.NODE_ENV ?? "development") === "production",
};
