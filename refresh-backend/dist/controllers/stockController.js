"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockController = void 0;
const data_source_1 = require("../data-source");
const Stock_1 = require("../entities/Stock");
const Product_1 = require("../entities/Product");
const Branch_1 = require("../entities/Branch");
class StockController {
    // CREATE / ADD STOCK
    static async createStock(req, res) {
        try {
            const { productId, branchId, quantity } = req.body;
            if (!productId || !branchId || quantity === undefined) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const stockRepo = data_source_1.AppDataSource.getRepository(Stock_1.Stock);
            const productRepo = data_source_1.AppDataSource.getRepository(Product_1.Product);
            const branchRepo = data_source_1.AppDataSource.getRepository(Branch_1.Branch);
            const product = await productRepo.findOneBy({ id: productId });
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            const branch = await branchRepo.findOneBy({ id: branchId });
            if (!branch) {
                return res.status(404).json({ message: "Branch not found" });
            }
            // Check if stock already exists for product + branch
            let stock = await stockRepo.findOne({
                where: {
                    product: { id: productId },
                    branch: { id: branchId },
                },
                relations: ["product", "branch"],
            });
            if (stock) {
                // Increase quantity
                stock.quantity += quantity;
            }
            else {
                stock = stockRepo.create({
                    product,
                    branch,
                    quantity,
                });
            }
            await stockRepo.save(stock);
            return res.status(201).json({
                message: "Stock saved successfully",
                stock,
            });
        }
        catch (error) {
            console.error("Create stock error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // GET ALL STOCK
    static async getAllStock(req, res) {
        try {
            const stockRepo = data_source_1.AppDataSource.getRepository(Stock_1.Stock);
            const stock = await stockRepo.find({
                relations: ["product", "branch"],
            });
            return res.status(200).json(stock);
        }
        catch (error) {
            console.error("Get stock error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // GET STOCK BY ID
    static async getStockById(req, res) {
        try {
            const { id } = req.params;
            const stockRepo = data_source_1.AppDataSource.getRepository(Stock_1.Stock);
            const stock = await stockRepo.findOne({
                where: { id: Number(id) },
                relations: ["product", "branch"],
            });
            if (!stock) {
                return res.status(404).json({ message: "Stock not found" });
            }
            return res.status(200).json(stock);
        }
        catch (error) {
            console.error("Get stock error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // GET STOCK BY BRANCH
    static async getStockByBranch(req, res) {
        try {
            const { branchId } = req.params;
            const stockRepo = data_source_1.AppDataSource.getRepository(Stock_1.Stock);
            const stock = await stockRepo.find({
                where: { branch: { id: Number(branchId) } },
                relations: ["product"],
            });
            return res.status(200).json(stock);
        }
        catch (error) {
            console.error("Get branch stock error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // UPDATE STOCK QUANTITY
    static async updateStock(req, res) {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
            const stockRepo = data_source_1.AppDataSource.getRepository(Stock_1.Stock);
            const stock = await stockRepo.findOneBy({ id: Number(id) });
            if (!stock) {
                return res.status(404).json({ message: "Stock not found" });
            }
            stock.quantity = quantity;
            await stockRepo.save(stock);
            return res.status(200).json({
                message: "Stock updated successfully",
                stock,
            });
        }
        catch (error) {
            console.error("Update stock error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // DELETE STOCK
    static async deleteStock(req, res) {
        try {
            const { id } = req.params;
            const stockRepo = data_source_1.AppDataSource.getRepository(Stock_1.Stock);
            const stock = await stockRepo.findOneBy({ id: Number(id) });
            if (!stock) {
                return res.status(404).json({ message: "Stock not found" });
            }
            await stockRepo.remove(stock);
            return res.status(200).json({
                message: "Stock deleted successfully",
            });
        }
        catch (error) {
            console.error("Delete stock error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.StockController = StockController;
