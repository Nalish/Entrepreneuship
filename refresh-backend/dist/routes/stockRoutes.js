"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const stockController_1 = require("../controllers/stockController");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const router = (0, express_1.Router)();
router.post("/", upload.none(), stockController_1.StockController.createStock);
router.get("/", stockController_1.StockController.getAllStock);
router.get("/:id", stockController_1.StockController.getStockById);
router.get("/branch/:branchId", stockController_1.StockController.getStockByBranch);
router.put("/:id", upload.none(), stockController_1.StockController.updateStock);
router.delete("/:id", stockController_1.StockController.deleteStock);
exports.default = router;
