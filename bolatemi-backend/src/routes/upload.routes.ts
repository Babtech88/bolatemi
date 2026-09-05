import { Router } from "express";
import { upload } from "../middleware/upload";
import { uploadImage, uploadImages } from "../controllers/upload.controller";
import { authenticate, authorize } from "../middleware/auth";

const router = Router();

router.post("/", authenticate, authorize("SUPER_ADMIN", "ADMIN"), upload.single("image"), uploadImage);
router.post("/bulk", authenticate, authorize("SUPER_ADMIN", "ADMIN"), upload.array("images", 10), uploadImages);

export default router;
