import { Router } from "express";
import { AuthController } from "../controllers/authController";
import multer from "multer"

const upload=multer();

const router = Router();

router.post("/register",upload.none(), AuthController.register);
router.post("/login",upload.none(), AuthController.login);

export default router;
