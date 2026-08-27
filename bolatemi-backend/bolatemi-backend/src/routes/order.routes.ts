import { Router } from "express";
import * as orderController from "../controllers/order.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createOrderSchema } from "../validators/order.validator";

const router = Router();

// Checkout flow: create order -> redirect customer to checkoutUrl -> Paystack
// redirects back -> frontend calls verify to confirm + show receipt.
router.post("/", validate(createOrderSchema), orderController.createOrder);
router.get("/verify/:reference", orderController.verifyPayment);

// Admin order management
router.get("/", authenticate, authorize("SUPER_ADMIN", "ADMIN", "SALES"), orderController.listOrders);
router.get("/:id", authenticate, authorize("SUPER_ADMIN", "ADMIN", "SALES"), orderController.getOrder);

export default router;
