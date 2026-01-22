"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductController = void 0;
const data_source_1 = require("../data-source");
const Product_1 = require("../entities/Product");
class ProductController {
    // Create product
    static async create(req, res) {
        try {
            const { name, price } = req.body;
            if (!name || price === undefined) {
                return res.status(400).json({
                    message: "Name and price are required",
                });
            }
            const productRepo = data_source_1.AppDataSource.getRepository(Product_1.Product);
            const product = productRepo.create({
                name,
                price,
            });
            await productRepo.save(product);
            return res.status(201).json({
                message: "Product created successfully",
                data: product,
            });
        }
        catch (error) {
            return res.status(500).json({
                message: "Error creating product",
                error,
            });
        }
    }
    // Get all products
    static async getAll(req, res) {
        try {
            const productRepo = data_source_1.AppDataSource.getRepository(Product_1.Product);
            const products = await productRepo.find({
                relations: ["stock", "saleItems"],
            });
            return res.json(products);
        }
        catch (error) {
            return res.status(500).json({
                message: "Error fetching products",
                error,
            });
        }
    }
    // Get single product by ID
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const productRepo = data_source_1.AppDataSource.getRepository(Product_1.Product);
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
        }
        catch (error) {
            return res.status(500).json({
                message: "Error fetching product",
                error,
            });
        }
    }
    // Update product
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { name, price } = req.body;
            const productRepo = data_source_1.AppDataSource.getRepository(Product_1.Product);
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
        }
        catch (error) {
            return res.status(500).json({
                message: "Error updating product",
                error,
            });
        }
    }
    // Delete product
    static async delete(req, res) {
        try {
            const { id } = req.params;
            const productRepo = data_source_1.AppDataSource.getRepository(Product_1.Product);
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
        }
        catch (error) {
            return res.status(500).json({
                message: "Error deleting product",
                error,
            });
        }
    }
}
exports.ProductController = ProductController;
