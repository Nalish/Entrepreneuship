import { Router } from "express";
import { PaymentController } from "../controllers/paymentController";

const router = Router();

router.post("/", PaymentController.createPayment);
router.get("/", PaymentController.getAllPayments);
router.get("/:id", PaymentController.getPaymentById);
router.get("/sale/:saleId", PaymentController.getPaymentsBySale);
router.delete("/:id", PaymentController.deletePayment);

export default router;
