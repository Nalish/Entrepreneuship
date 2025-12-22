import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/Product";


export class ProductController {
  // Create product
  static async create(req: Request, res: Response) {
    try {
      const { name, price } = req.body;

      if (!name || price === undefined) {
        return res.status(400).json({
          message: "Name and price are required",
        });
      }

      const productRepo = AppDataSource.getRepository(Product);

      const product = productRepo.create({
        name,
        price,
      });

      await productRepo.save(product);

      return res.status(201).json({
        message: "Product created successfully",
        data: product,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error creating product",
        error,
      });
    }
  }

  // Get all products
  static async getAll(req: Request, res: Response) {
    try {
      const productRepo = AppDataSource.getRepository(Product);

      const products = await productRepo.find({
        relations: ["stock", "saleItems"],
      });

      return res.json(products);
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching products",
        error,
      });
    }
  }

  // Get single product by ID
  static async getById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const productRepo = AppDataSource.getRepository(Product);

      const product = await productRepo.findOne({
        where: { id: Number(id) },
        relations: ["stock", "saleItems"],
      });

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      return res.json(product);
    } catch (error) {
      return res.status(500).json({
        message: "Error fetching product",
        error,
      });
    }
  }

  // Update product
  static async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name, price } = req.body;

      const productRepo = AppDataSource.getRepository(Product);
      const product = await productRepo.findOneBy({ id: Number(id) });

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      product.name = name ?? product.name;
      product.price = price ?? product.price;

      await productRepo.save(product);

      return res.json({
        message: "Product updated successfully",
        data: product,
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error updating product",
        error,
      });
    }
  }

  // Delete product
  static async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const productRepo = AppDataSource.getRepository(Product);

      const product = await productRepo.findOneBy({ id: Number(id) });

      if (!product) {
        return res.status(404).json({
          message: "Product not found",
        });
      }

      await productRepo.remove(product);

      return res.json({
        message: "Product deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        message: "Error deleting product",
        error,
      });
    }
  }
}
