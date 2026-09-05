// Vercel's serverless platform auto-deploys any file under /api/ as a
// function. This one file IS the entire backend on Vercel — it just
// hands the whole already-built Express app to Vercel's Node runtime,
// which is a valid request handler as-is (Express apps are (req, res)
// functions under the hood). vercel.json rewrites every incoming path to
// this function while preserving the original URL, so Express's own
// internal routing (app.use("/api", routes) etc.) still works unchanged.
import { app } from "../src/app";

export default app;
