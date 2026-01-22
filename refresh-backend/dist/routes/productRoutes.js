"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productController_1 = require("../controllers/productController");
const multer_1 = __importDefault(require("multer"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
router.post("/", upload.none(), productController_1.ProductController.create);
router.get("/", productController_1.ProductController.getAll);
router.get("/:id", productController_1.ProductController.getById);
router.patch("/:id", upload.none(), productController_1.ProductController.update);
router.delete("/:id", productController_1.ProductController.delete);
exports.default = router;
