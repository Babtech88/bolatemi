import { Router } from "express";
import { getDashboardStats } from "../controllers/admin.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.get("/dashboard", authenticate, authorize("SUPER_ADMIN", "ADMIN"), getDashboardStats);

export default router;
