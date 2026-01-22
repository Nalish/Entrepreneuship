"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaleItemController = void 0;
const data_source_1 = require("../data-source");
const SaleItem_1 = require("../entities/SaleItem");
const Sale_1 = require("../entities/Sale");
const Product_1 = require("../entities/Product");
class SaleItemController {
    // CREATE SALE ITEM
    static async createSaleItem(req, res) {
        try {
            const { saleId, productId, quantity, unitPrice } = req.body;
            if (!saleId || !productId || !quantity || !unitPrice) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const saleRepo = data_source_1.AppDataSource.getRepository(Sale_1.Sale);
            const productRepo = data_source_1.AppDataSource.getRepository(Product_1.Product);
            const saleItemRepo = data_source_1.AppDataSource.getRepository(SaleItem_1.SaleItem);
            const sale = await saleRepo.findOneBy({ id: saleId });
            if (!sale) {
                return res.status(404).json({ message: "Sale not found" });
            }
            const product = await productRepo.findOneBy({ id: productId });
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            const saleItem = saleItemRepo.create({
                sale,
                product,
                quantity,
                unitPrice,
            });
            await saleItemRepo.save(saleItem);
            return res.status(201).json({
                message: "Sale item created successfully",
                saleItem,
            });
        }
        catch (error) {
            console.error("Create sale item error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // GET ALL SALE ITEMS
    static async getAllSaleItems(req, res) {
        try {
            const saleItemRepo = data_source_1.AppDataSource.getRepository(SaleItem_1.SaleItem);
            const saleItems = await saleItemRepo.find({
                relations: ["sale", "product"],
            });
            return res.status(200).json(saleItems);
        }
        catch (error) {
            console.error("Get sale items error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // GET SALE ITEM BY ID
    static async getSaleItemById(req, res) {
        try {
            const { id } = req.params;
            const saleItemRepo = data_source_1.AppDataSource.getRepository(SaleItem_1.SaleItem);
            const saleItem = await saleItemRepo.findOne({
                where: { id: Number(id) },
                relations: ["sale", "product"],
            });
            if (!saleItem) {
                return res.status(404).json({ message: "Sale item not found" });
            }
            return res.status(200).json(saleItem);
        }
        catch (error) {
            console.error("Get sale item error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // UPDATE SALE ITEM
    static async updateSaleItem(req, res) {
        try {
            const { id } = req.params;
            const { quantity, unitPrice } = req.body;
            const saleItemRepo = data_source_1.AppDataSource.getRepository(SaleItem_1.SaleItem);
            const saleItem = await saleItemRepo.findOneBy({ id: Number(id) });
            if (!saleItem) {
                return res.status(404).json({ message: "Sale item not found" });
            }
            if (quantity !== undefined)
                saleItem.quantity = quantity;
            if (unitPrice !== undefined)
                saleItem.unitPrice = unitPrice;
            await saleItemRepo.save(saleItem);
            return res.status(200).json({
                message: "Sale item updated successfully",
                saleItem,
            });
        }
        catch (error) {
            console.error("Update sale item error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // DELETE SALE ITEM
    static async deleteSaleItem(req, res) {
        try {
            const { id } = req.params;
            const saleItemRepo = data_source_1.AppDataSource.getRepository(SaleItem_1.SaleItem);
            const saleItem = await saleItemRepo.findOneBy({ id: Number(id) });
            if (!saleItem) {
                return res.status(404).json({ message: "Sale item not found" });
            }
            await saleItemRepo.remove(saleItem);
            return res.status(200).json({
                message: "Sale item deleted successfully",
            });
        }
        catch (error) {
            console.error("Delete sale item error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.SaleItemController = SaleItemController;
