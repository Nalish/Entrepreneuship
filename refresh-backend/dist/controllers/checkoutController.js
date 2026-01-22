"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckoutController = void 0;
const data_source_1 = require("../data-source");
const Sale_1 = require("../entities/Sale");
const SaleItem_1 = require("../entities/SaleItem");
const Stock_1 = require("../entities/Stock");
const Branch_1 = require("../entities/Branch");
const User_1 = require("../entities/User");
class CheckoutController {
    static async checkout(req, res) {
        const { branchId, customerId, items } = req.body;
        if (!customerId) {
            return res.status(400).json({ message: "Customer ID is required" });
        }
        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }
        try {
            const sale = await data_source_1.AppDataSource.transaction(async (manager) => {
                // 1. Validate customer and branch exist
                const customer = await manager.findOne(User_1.User, { where: { id: customerId } });
                if (!customer) {
                    throw new Error(`Customer with ID ${customerId} not found`);
                }
                const branch = await manager.findOne(Branch_1.Branch, { where: { id: branchId } });
                if (!branch) {
                    throw new Error(`Branch with ID ${branchId} not found`);
                }
                // 2. Validate stock
                for (const item of items) {
                    const stock = await manager
                        .createQueryBuilder(Stock_1.Stock, "stock")
                        .leftJoinAndSelect("stock.product", "product")
                        .leftJoinAndSelect("stock.branch", "branch")
                        .where("product.id = :productId", { productId: item.productId })
                        .andWhere("branch.id = :branchId", { branchId: branchId })
                        .getOne();
                    if (!stock) {
                        throw new Error(`No stock found for product ${item.productId} in branch ${branchId}`);
                    }
                    if (stock.quantity < item.quantity) {
                        throw new Error(`Insufficient stock for product ${item.productId}. Available: ${stock.quantity}, Requested: ${item.quantity}`);
                    }
                }
                // 3. Create Sale
                const sale = manager.create(Sale_1.Sale, {
                    customer,
                    branch,
                    totalAmount: items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),
                });
                await manager.save(sale);
                // 4. Create SaleItems + reduce stock
                for (const item of items) {
                    const saleItem = manager.create(SaleItem_1.SaleItem, {
                        sale,
                        product: { id: item.productId },
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                    });
                    await manager.save(saleItem);
                    await manager.decrement(Stock_1.Stock, {
                        product: { id: item.productId },
                        branch: { id: branchId },
                    }, "quantity", item.quantity);
                }
                return sale;
            });
            res.status(201).json({
                message: "Checkout successful",
                saleId: sale.id,
                items: sale.items,
                totalAmount: sale.totalAmount,
            });
        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}
exports.CheckoutController = CheckoutController;
