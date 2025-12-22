import { Router } from "express";
import { ProductController } from "../controllers/productController";
import multer from "multer";

const router = Router();
const upload =multer()

router.post("/",upload.none(), ProductController.create);
router.get("/", ProductController.getAll);
router.get("/:id", ProductController.getById);
router.patch("/:id",upload.none(), ProductController.update);
router.delete("/:id", ProductController.delete);

export default router;
