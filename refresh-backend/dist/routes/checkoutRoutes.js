"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/routes/checkoutRoutes.ts
const express_1 = require("express");
const checkoutController_1 = require("../controllers/checkoutController");
const router = (0, express_1.Router)();
router.post("/", checkoutController_1.CheckoutController.checkout);
exports.default = router;
