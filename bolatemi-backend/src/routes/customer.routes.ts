import { Router } from "express";
import * as customerController from "../controllers/customer.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, authorize("SUPER_ADMIN", "ADMIN", "SALES"), customerController.listCustomers);
router.get("/:id", authenticate, authorize("SUPER_ADMIN", "ADMIN", "SALES"), customerController.getCustomer);

export default router;
