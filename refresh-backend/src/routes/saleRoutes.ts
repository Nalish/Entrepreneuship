import { Router } from "express";
import { SaleController } from "../controllers/saleController";
import multer from "multer";

const router = Router();
const upload=multer()


router.post("/",upload.none(), SaleController.createSale);
router.get("/", SaleController.getAllSales);
router.get("/:id", SaleController.getSaleById);
router.get("/branch/:branchId", SaleController.getSalesByBranch);
router.get("/customer/:customerId", SaleController.getSalesByCustomer);

export default router;
