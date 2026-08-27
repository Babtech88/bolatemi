import { Router } from "express";
import * as c from "../controllers/testimonial.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createTestimonialSchema } from "../validators/content.validator";

const router = Router();

router.get("/", c.listApprovedTestimonials);
router.post("/", validate(createTestimonialSchema), c.submitTestimonial);

router.get("/admin/all", authenticate, authorize("SUPER_ADMIN", "ADMIN"), c.listAllTestimonials);
router.patch("/:id/approval", authenticate, authorize("SUPER_ADMIN", "ADMIN"), c.setTestimonialApproval);
router.delete("/:id", authenticate, authorize("SUPER_ADMIN", "ADMIN"), c.deleteTestimonial);

export default router;
