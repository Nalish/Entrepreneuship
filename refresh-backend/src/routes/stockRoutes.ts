import { Router } from "express";
import { StockController } from "../controllers/stockController";
import multer from "multer"

const upload = multer();
const router = Router();

// FIXED ROUTES FIRST
router.post("/hq", upload.none(), StockController.stockHQ);
router.post("/", upload.none(), StockController.createStock);
router.get("/branch/:branchId", StockController.getStockByBranch);

// DYNAMIC ROUTES LAST
router.get("/:id", StockController.getStockById);
router.put("/:id", upload.none(), StockController.updateStock);
router.delete("/:id", StockController.deleteStock);
router.get("/", StockController.getAllStock);

export default router;
