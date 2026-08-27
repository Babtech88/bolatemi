import { Router } from "express";
import * as productController from "../controllers/product.controller";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createProductSchema, updateProductSchema, listProductsQuerySchema } from "../validators/product.validator";

const router = Router();

// Public storefront routes
router.get("/", validate(listProductsQuerySchema, "query"), productController.listProducts);
router.get("/:slug", productController.getProduct);

// Admin-only management routes
router.post("/", authenticate, authorize("SUPER_ADMIN", "ADMIN"), validate(createProductSchema), productController.createProduct);
router.patch("/:id", authenticate, authorize("SUPER_ADMIN", "ADMIN"), validate(updateProductSchema), productController.updateProduct);
router.delete("/:id", authenticate, authorize("SUPER_ADMIN", "ADMIN"), productController.deleteProduct);

export default router;
