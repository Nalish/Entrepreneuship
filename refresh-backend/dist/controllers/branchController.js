"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchController = void 0;
const data_source_1 = require("../data-source");
const Branch_1 = require("../entities/Branch");
class BranchController {
    // CREATE BRANCH
    static async createBranch(req, res) {
        try {
            const { name, location } = req.body;
            if (!name || !location) {
                return res.status(400).json({ message: "Name and location are required" });
            }
            const branchRepo = data_source_1.AppDataSource.getRepository(Branch_1.Branch);
            const branch = branchRepo.create({ name, location });
            await branchRepo.save(branch);
            return res.status(201).json({
                message: "Branch created successfully",
                branch,
            });
        }
        catch (error) {
            console.error("Create branch error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // GET ALL BRANCHES
    static async getAllBranches(req, res) {
        try {
            const branchRepo = data_source_1.AppDataSource.getRepository(Branch_1.Branch);
            const branches = await branchRepo.find({
                relations: ["stock", "sales"],
            });
            return res.status(200).json(branches);
        }
        catch (error) {
            console.error("Get branches error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // GET BRANCH BY ID
    static async getBranchById(req, res) {
        try {
            const { id } = req.params;
            const branchRepo = data_source_1.AppDataSource.getRepository(Branch_1.Branch);
            const branch = await branchRepo.findOne({
                where: { id: Number(id) },
                relations: ["stock", "sales"],
            });
            if (!branch) {
                return res.status(404).json({ message: "Branch not found" });
            }
            return res.status(200).json(branch);
        }
        catch (error) {
            console.error("Get branch error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // UPDATE BRANCH
    static async updateBranch(req, res) {
        try {
            const { id } = req.params;
            const { name, location } = req.body;
            const branchRepo = data_source_1.AppDataSource.getRepository(Branch_1.Branch);
            const branch = await branchRepo.findOneBy({ id: Number(id) });
            if (!branch) {
                return res.status(404).json({ message: "Branch not found" });
            }
            if (name !== undefined)
                branch.name = name;
            if (location !== undefined)
                branch.location = location;
            await branchRepo.save(branch);
            return res.status(200).json({
                message: "Branch updated successfully",
                branch,
            });
        }
        catch (error) {
            console.error("Update branch error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // DELETE BRANCH
    static async deleteBranch(req, res) {
        try {
            const { id } = req.params;
            const branchRepo = data_source_1.AppDataSource.getRepository(Branch_1.Branch);
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
        }
        catch (error) {
            console.error("Delete branch error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.BranchController = BranchController;
