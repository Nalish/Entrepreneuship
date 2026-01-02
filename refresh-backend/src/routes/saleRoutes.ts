import { Router } from "express";
import { SaleController } from "../controllers/saleController";

const router = Router();

router.post("/", SaleController.createSale);
router.get("/", SaleController.getAllSales);
router.get("/:id", SaleController.getSaleById);
router.get("/branch/:branchId", SaleController.getSalesByBranch);
router.get("/customer/:customerId", SaleController.getSalesByCustomer);

export default router;
