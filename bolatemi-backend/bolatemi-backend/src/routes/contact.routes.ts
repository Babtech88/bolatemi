import { Router } from "express";
import * as c from "../controllers/contact.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createContactMessageSchema } from "../validators/content.validator";

const router = Router();

router.post("/", validate(createContactMessageSchema), c.submitContactMessage);
router.get("/", authenticate, authorize("SUPER_ADMIN", "ADMIN", "SALES"), c.listContactMessages);
router.patch("/:id/read", authenticate, authorize("SUPER_ADMIN", "ADMIN", "SALES"), c.markContactMessageRead);

export default router;
