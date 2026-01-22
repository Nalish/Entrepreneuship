"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const saleController_1 = require("../controllers/saleController");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
router.post("/", upload.none(), saleController_1.SaleController.createSale);
router.get("/", saleController_1.SaleController.getAllSales);
router.get("/:id", saleController_1.SaleController.getSaleById);
router.get("/branch/:branchId", saleController_1.SaleController.getSalesByBranch);
router.get("/customer/:customerId", saleController_1.SaleController.getSalesByCustomer);
exports.default = router;
