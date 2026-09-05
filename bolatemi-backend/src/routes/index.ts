import { Router } from "express";
import authRoutes from "./auth.routes";
import productRoutes from "./product.routes";
import categoryRoutes from "./category.routes";
import orderRoutes from "./order.routes";
import quoteRoutes from "./quote.routes";
import customerRoutes from "./customer.routes";
import testimonialRoutes from "./testimonial.routes";
import contactRoutes from "./contact.routes";
import adminRoutes from "./admin.routes";
import uploadRoutes from "./upload.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/products", productRoutes);
router.use("/categories", categoryRoutes);
router.use("/orders", orderRoutes);
router.use("/quotes", quoteRoutes);
router.use("/customers", customerRoutes);
router.use("/testimonials", testimonialRoutes);
router.use("/contact", contactRoutes);
router.use("/admin", adminRoutes);
router.use("/uploads", uploadRoutes);

export default router;
