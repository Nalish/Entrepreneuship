import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Sale } from "../entities/Sale";
import { User } from "../entities/User";
import { Branch } from "../entities/Branch";
import { SaleItem } from "../entities/SaleItem";

export class SaleController {
  // CREATE SALE
 static async createSale(req: Request, res: Response) {
  try {
    const { branchId, items, totalAmount } = req.body;

    const userId = (req as any).user?.id;
    const userRole = (req as any).user?.role;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (userRole !== "customer") {
      return res.status(403).json({ message: "Only customers can make sales" });
    }

    if (!branchId || !items || items.length === 0) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userRepo = AppDataSource.getRepository(User);
    const branchRepo = AppDataSource.getRepository(Branch);
    const saleRepo = AppDataSource.getRepository(Sale);

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
      items: items.map((item: any) => {
        const saleItem = new SaleItem();
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
  } catch (error) {
    console.error("Create sale error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}


  // GET ALL SALES
  static async getAllSales(req: Request, res: Response) {
    try {
      const saleRepo = AppDataSource.getRepository(Sale);

      const sales = await saleRepo.find({
        relations: ["customer", "branch", "items", "payments"],
        order: { saleDate: "DESC" },
      });

      return res.status(200).json(sales);
    } catch (error) {
      console.error("Get sales error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET SINGLE SALE
  static async getSaleById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const saleRepo = AppDataSource.getRepository(Sale);

      const sale = await saleRepo.findOne({
        where: { id: Number(id) },
        relations: ["customer", "branch", "items", "payments"],
      });

      if (!sale) {
        return res.status(404).json({ message: "Sale not found" });
      }

      return res.status(200).json(sale);
    } catch (error) {
      console.error("Get sale error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET SALES BY BRANCH
  static async getSalesByBranch(req: Request, res: Response) {
    try {
      const { branchId } = req.params;
      const saleRepo = AppDataSource.getRepository(Sale);

      const sales = await saleRepo.find({
        where: { branch: { id: Number(branchId) } },
        relations: ["customer", "items", "payments"],
      });

      return res.status(200).json(sales);
    } catch (error) {
      console.error("Get branch sales error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET SALES BY CUSTOMER
  static async getSalesByCustomer(req: Request, res: Response) {
    try {
      const { customerId } = req.params;
      const saleRepo = AppDataSource.getRepository(Sale);

      const sales = await saleRepo.find({
        where: { customer: { id: Number(customerId) } },
        relations: ["branch", "items", "payments"],
      });

      return res.status(200).json(sales);
    } catch (error) {
      console.error("Get customer sales error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
