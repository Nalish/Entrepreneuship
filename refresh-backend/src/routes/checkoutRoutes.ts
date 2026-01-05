// src/routes/checkoutRoutes.ts
import { Router } from "express";
import { CheckoutController } from "../controllers/checkoutController";

const router = Router();

router.post("/", CheckoutController.checkout);

export default router;
