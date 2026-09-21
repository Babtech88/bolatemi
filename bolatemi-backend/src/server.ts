import { app } from "./app";
import { env } from "./config/env";
import { prisma } from "./config/db";

async function main() {
  await prisma.$connect();
  app.listen(env.port, () => {
    console.log(`Bolatemi API listening on port ${env.port} [${env.nodeEnv}]`);
  });
}

main().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

import path from "path";
import express from "express";

const app = express();

app.get("/favicon.ico", (_req, res) => {
  res.sendFile(path.join(process.cwd(), "public", "favicon.ico"));
});