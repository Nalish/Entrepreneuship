import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Branch } from "../entities/Branch";

export class BranchController {
  // CREATE BRANCH
  static async createBranch(req: Request, res: Response) {
    try {
      const { name, location } = req.body;

      if (!name || !location) {
        return res.status(400).json({ message: "Name and location are required" });
      }

      const branchRepo = AppDataSource.getRepository(Branch);

      const branch = branchRepo.create({ name, location });
      await branchRepo.save(branch);

      return res.status(201).json({
        message: "Branch created successfully",
        branch,
      });
    } catch (error) {
      console.error("Create branch error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET ALL BRANCHES
  static async getAllBranches(req: Request, res: Response) {
    try {
      const branchRepo = AppDataSource.getRepository(Branch);

      const branches = await branchRepo.find({
        relations: ["stock", "sales"],
      });

      return res.status(200).json(branches);
    } catch (error) {
      console.error("Get branches error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET BRANCH BY ID
  static async getBranchById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const branchRepo = AppDataSource.getRepository(Branch);

      const branch = await branchRepo.findOne({
        where: { id: Number(id) },
        relations: ["stock", "sales"],
      });

      if (!branch) {
        return res.status(404).json({ message: "Branch not found" });
      }

      return res.status(200).json(branch);
    } catch (error) {
      console.error("Get branch error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

 // UPDATE BRANCH
// PATCH / UPDATE BRANCH
static async updateBranch(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, location, isHQ } = req.body; // Partial update allowed

    const branchRepo = AppDataSource.getRepository(Branch);
    const branch = await branchRepo.findOneBy({ id: Number(id) });

    if (!branch) {
      return res.status(404).json({ message: "Branch not found" });
    }

    // Update only the fields that were sent
    if (name !== undefined) branch.name = name;
    if (location !== undefined) branch.location = location;

    if (isHQ !== undefined) {
      if (isHQ) {
        // If this branch is being set as HQ, unset HQ for all other branches
        await branchRepo
          .createQueryBuilder()
          .update(Branch)
          .set({ isHQ: false })
          .where("id != :id", { id: branch.id })
          .execute();
      }
      branch.isHQ = isHQ;
    }

    await branchRepo.save(branch);

    return res.status(200).json({
      message: "Branch updated successfully",
      branch,
    });
  } catch (error) {
    console.error("Patch branch error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


  // DELETE BRANCH
  static async deleteBranch(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const branchRepo = AppDataSource.getRepository(Branch);

      const branch = await branchRepo.findOne({
        where: { id: Number(id) },
        relations: ["sales"],
      });

      if (!branch) {
        return res.status(404).json({ message: "Branch not found" });
      }

      // Optional safety check
      if (branch.sales.length > 0) {
        return res.status(400).json({
          message: "Cannot delete branch with existing sales",
        });
      }

      await branchRepo.remove(branch);

      return res.status(200).json({
        message: "Branch deleted successfully",
      });
    } catch (error) {
      console.error("Delete branch error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
