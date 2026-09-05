import { Router } from "express";
import * as categoryController from "../controllers/category.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createCategorySchema } from "../validators/product.validator";

const router = Router();

router.get("/", categoryController.listCategories);
router.post("/", authenticate, authorize("SUPER_ADMIN", "ADMIN"), validate(createCategorySchema), categoryController.createCategory);
router.patch("/:id", authenticate, authorize("SUPER_ADMIN", "ADMIN"), categoryController.updateCategory);
router.delete("/:id", authenticate, authorize("SUPER_ADMIN"), categoryController.deleteCategory);

export default router;
