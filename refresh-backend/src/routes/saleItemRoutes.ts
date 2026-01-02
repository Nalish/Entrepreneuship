import { Router } from "express";
import { SaleItemController } from "../controllers/saleItemController";

const router = Router();

router.post("/", SaleItemController.createSaleItem);
router.get("/", SaleItemController.getAllSaleItems);
router.get("/:id", SaleItemController.getSaleItemById);
router.put("/:id", SaleItemController.updateSaleItem);
router.delete("/:id", SaleItemController.deleteSaleItem);

export default router;
