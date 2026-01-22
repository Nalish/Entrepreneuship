// src/controllers/CheckoutController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Sale } from "../entities/Sale";
import { SaleItem } from "../entities/SaleItem";
import { Stock } from "../entities/Stock";
import { Product } from "../entities/Product";
import { Branch } from "../entities/Branch";
import { User } from "../entities/User";

export class CheckoutController {
  static async checkout(req: Request, res: Response) {
    const { branchId, customerId, items } = req.body;

    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    try {
      const sale = await AppDataSource.transaction(async (manager) => {

        // 1. Validate customer and branch exist
        const customer = await manager.findOne(User, { where: { id: customerId } });
        if (!customer) {
          throw new Error(`Customer with ID ${customerId} not found`);
        }

        const branch = await manager.findOne(Branch, { where: { id: branchId } });
        if (!branch) {
          throw new Error(`Branch with ID ${branchId} not found`);
        }

        // 2. Validate stock
        for (const item of items) {
          const stock = await manager
            .createQueryBuilder(Stock, "stock")
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
        const sale = manager.create(Sale, {
          customer,
          branch,
          totalAmount: items.reduce(
            (sum: number, i: any) => sum + i.unitPrice * i.quantity,
            0
          ),
        });

        await manager.save(sale);

        // 4. Create SaleItems + reduce stock
        for (const item of items) {
          const saleItem = manager.create(SaleItem, {
            sale,
            product: { id: item.productId },
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          });

          await manager.save(saleItem);

          await manager.decrement(
            Stock,
            {
              product: { id: item.productId },
              branch: { id: branchId },
            },
            "quantity",
            item.quantity
          );
        }

        return sale;
      });

    res.status(201).json({
  message: "Checkout successful",
  saleId: sale.id,
  items: sale.items,
  totalAmount: sale.totalAmount,
});

    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }
}
