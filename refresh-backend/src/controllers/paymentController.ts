import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Payment, PaymentMethod } from "../entities/Payment";
import { Sale } from "../entities/Sale";

export class PaymentController {
  // CREATE PAYMENT
  static async createPayment(req: Request, res: Response) {
    try {
      const { saleId, amount, method } = req.body;

      if (!saleId || amount === undefined || !method) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      // Validate payment method
      if (!Object.values(PaymentMethod).includes(method)) {
        return res.status(400).json({ message: "Invalid payment method" });
      }

      const paymentRepo = AppDataSource.getRepository(Payment);
      const saleRepo = AppDataSource.getRepository(Sale);

      const sale = await saleRepo.findOne({
        where: { id: saleId },
        relations: ["payments"],
      });

      if (!sale) {
        return res.status(404).json({ message: "Sale not found" });
      }

      // Optional: prevent overpayment
      const totalPaid = sale.payments.reduce(
        (sum, payment) => sum + Number(payment.amount),
        0
      );

      if (totalPaid + amount > Number(sale.totalAmount)) {
        return res.status(400).json({
          message: "Payment exceeds sale total amount",
        });
      }

      const payment = paymentRepo.create({
        sale,
        amount,
        method,
      });

      await paymentRepo.save(payment);

      return res.status(201).json({
        message: "Payment recorded successfully",
        payment,
      });
    } catch (error) {
      console.error("Create payment error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET ALL PAYMENTS
  static async getAllPayments(req: Request, res: Response) {
    try {
      const paymentRepo = AppDataSource.getRepository(Payment);

      const payments = await paymentRepo.find({
        relations: ["sale"],
        order: { paymentDate: "DESC" },
      });

      return res.status(200).json(payments);
    } catch (error) {
      console.error("Get payments error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET PAYMENT BY ID
  static async getPaymentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const paymentRepo = AppDataSource.getRepository(Payment);

      const payment = await paymentRepo.findOne({
        where: { id: Number(id) },
        relations: ["sale"],
      });

      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      return res.status(200).json(payment);
    } catch (error) {
      console.error("Get payment error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET PAYMENTS BY SALE
  static async getPaymentsBySale(req: Request, res: Response) {
    try {
      const { saleId } = req.params;
      const paymentRepo = AppDataSource.getRepository(Payment);

      const payments = await paymentRepo.find({
        where: { sale: { id: Number(saleId) } },
        order: { paymentDate: "ASC" },
      });

      return res.status(200).json(payments);
    } catch (error) {
      console.error("Get sale payments error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // DELETE PAYMENT (optional)
  static async deletePayment(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const paymentRepo = AppDataSource.getRepository(Payment);

      const payment = await paymentRepo.findOneBy({ id: Number(id) });
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      await paymentRepo.remove(payment);

      return res.status(200).json({
        message: "Payment deleted successfully",
      });
    } catch (error) {
      console.error("Delete payment error:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
