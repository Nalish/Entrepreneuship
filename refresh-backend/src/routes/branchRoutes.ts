import { Router } from "express";
import { BranchController } from './../controllers/branchController';
import multer from "multer"

const upload=multer()

const router = Router();

router.post("/",upload.none(), BranchController.createBranch);
router.get("/", BranchController.getAllBranches);
router.get("/:id", BranchController.getBranchById);
router.put("/:id",upload.none(), BranchController.updateBranch);
router.delete("/:id", BranchController.deleteBranch);

export default router;
