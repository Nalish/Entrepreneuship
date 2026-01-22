"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleController = void 0;
const data_source_1 = require("../data-source");
const Sale_1 = require("../entities/Sale");
const User_1 = require("../entities/User");
const Branch_1 = require("../entities/Branch");
const SaleItem_1 = require("../entities/SaleItem");
class SaleController {
    // CREATE SALE
    static async createSale(req, res) {
        try {
            const { branchId, items, totalAmount } = req.body;
            const userId = req.user?.id;
            const userRole = req.user?.role;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            if (userRole !== "customer") {
                return res.status(403).json({ message: "Only customers can make sales" });
            }
            if (!branchId || !items || items.length === 0) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
            const branchRepo = data_source_1.AppDataSource.getRepository(Branch_1.Branch);
            const saleRepo = data_source_1.AppDataSource.getRepository(Sale_1.Sale);
            const customer = await userRepo.findOneBy({ id: userId });
            if (!customer) {
                return res.status(404).json({ message: "User not found" });
            }
            const branch = await branchRepo.findOneBy({ id: branchId });
            if (!branch) {
                return res.status(404).json({ message: "Branch not found" });
            }
            const sale = saleRepo.create({
                customer,
                branch,
                totalAmount,
                items: items.map((item) => {
                    const saleItem = new SaleItem_1.SaleItem();
                    saleItem.product = item.product; // OR productId (recommended)
                    saleItem.quantity = item.quantity;
                    saleItem.unitPrice = item.price; // 🔥 strongly recommended
                    return saleItem;
                }),
            });
            await saleRepo.save(sale);
            return res.status(201).json({
                message: "Sale created successfully",
                sale,
            });
        }
        catch (error) {
            console.error("Create sale error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // GET ALL SALES
    static async getAllSales(req, res) {
        try {
            const saleRepo = data_source_1.AppDataSource.getRepository(Sale_1.Sale);
            const sales = await saleRepo.find({
                relations: ["customer", "branch", "items", "payments"],
                order: { saleDate: "DESC" },
            });
            return res.status(200).json(sales);
        }
        catch (error) {
            console.error("Get sales error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // GET SINGLE SALE
    static async getSaleById(req, res) {
        try {
            const { id } = req.params;
            const saleRepo = data_source_1.AppDataSource.getRepository(Sale_1.Sale);
            const sale = await saleRepo.findOne({
                where: { id: Number(id) },
                relations: ["customer", "branch", "items", "payments"],
            });
            if (!sale) {
                return res.status(404).json({ message: "Sale not found" });
            }
            return res.status(200).json(sale);
        }
        catch (error) {
            console.error("Get sale error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // GET SALES BY BRANCH
    static async getSalesByBranch(req, res) {
        try {
            const { branchId } = req.params;
            const saleRepo = data_source_1.AppDataSource.getRepository(Sale_1.Sale);
            const sales = await saleRepo.find({
                where: { branch: { id: Number(branchId) } },
                relations: ["customer", "items", "payments"],
            });
            return res.status(200).json(sales);
        }
        catch (error) {
            console.error("Get branch sales error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // GET SALES BY CUSTOMER
    static async getSalesByCustomer(req, res) {
        try {
            const { customerId } = req.params;
            const saleRepo = data_source_1.AppDataSource.getRepository(Sale_1.Sale);
            const sales = await saleRepo.find({
                where: { customer: { id: Number(customerId) } },
                relations: ["branch", "items", "payments"],
            });
            return res.status(200).json(sales);
        }
        catch (error) {
            console.error("Get customer sales error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.SaleController = SaleController;
