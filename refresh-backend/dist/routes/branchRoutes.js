"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const branchController_1 = require("./../controllers/branchController");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)();
const router = (0, express_1.Router)();
router.post("/", upload.none(), branchController_1.BranchController.createBranch);
router.get("/", branchController_1.BranchController.getAllBranches);
router.get("/:id", branchController_1.BranchController.getBranchById);
router.put("/:id", upload.none(), branchController_1.BranchController.updateBranch);
router.delete("/:id", branchController_1.BranchController.deleteBranch);
exports.default = router;
