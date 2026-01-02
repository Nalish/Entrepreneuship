import { Router } from "express";
import { StockController } from "../controllers/stockController";
import multer from "multer"

const upload=multer()

const router = Router();

router.post("/",upload.none(), StockController.createStock);
router.get("/", StockController.getAllStock);
router.get("/:id", StockController.getStockById);
router.get("/branch/:branchId", StockController.getStockByBranch);
router.put("/:id",upload.none(), StockController.updateStock);
router.delete("/:id", StockController.deleteStock);

export default router;
