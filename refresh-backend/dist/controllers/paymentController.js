"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentController = void 0;
const data_source_1 = require("../data-source");
const Payment_1 = require("../entities/Payment");
const Sale_1 = require("../entities/Sale");
const mpesaService_1 = require("../services/mpesaService");
class PaymentController {
    // CREATE PAYMENT
    static async createPayment(req, res) {
        try {
            const { saleId, amount, method, phoneNumber } = req.body;
            if (!saleId || amount === undefined || !method) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            // Validate payment method
            if (!Object.values(Payment_1.PaymentMethod).includes(method)) {
                return res.status(400).json({ message: "Invalid payment method" });
            }
            // Validate M-Pesa requirements
            if (method === Payment_1.PaymentMethod.MPESA && !phoneNumber) {
                return res.status(400).json({ message: "Phone number required for M-Pesa" });
            }
            const paymentRepo = data_source_1.AppDataSource.getRepository(Payment_1.Payment);
            const saleRepo = data_source_1.AppDataSource.getRepository(Sale_1.Sale);
            const sale = await saleRepo.findOne({
                where: { id: saleId },
            });
            if (!sale) {
                return res.status(404).json({ message: "Sale not found" });
            }
            // Get payments without relations to avoid column issues
            const payments = await paymentRepo.find({
                where: { sale: { id: saleId } },
            });
            // Calculate total paid
            const totalPaid = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
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
            // Handle M-Pesa payment initiation
            if (method === Payment_1.PaymentMethod.MPESA) {
                try {
                    const stkResponse = await mpesaService_1.mpesaService.initiateSTKPush(phoneNumber, amount, sale.id.toString(), `Payment for Sale ${sale.id}`);
                    payment.mpesaCheckoutRequestId = stkResponse.CheckoutRequestID;
                    payment.mpesaMerchantRequestId = stkResponse.MerchantRequestID;
                }
                catch (error) {
                    // Log full error and return clearer details to client
                    console.error("M-Pesa error:", error);
                    const details = error?.response?.data || error?.message || String(error);
                    return res.status(500).json({
                        message: "Payment initiation failed",
                        details,
                    });
                }
            }
            await paymentRepo.save(payment);
            return res.status(201).json({
                message: "Payment recorded successfully",
                payment,
            });
        }
        catch (error) {
            console.error("Create payment error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // GET ALL PAYMENTS
    static async getAllPayments(req, res) {
        try {
            const paymentRepo = data_source_1.AppDataSource.getRepository(Payment_1.Payment);
            const payments = await paymentRepo.find({
                relations: ["sale"],
                order: { paymentDate: "DESC" },
            });
            return res.status(200).json(payments);
        }
        catch (error) {
            console.error("Get payments error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // GET PAYMENT BY ID
    static async getPaymentById(req, res) {
        try {
            const { id } = req.params;
            const paymentRepo = data_source_1.AppDataSource.getRepository(Payment_1.Payment);
            const payment = await paymentRepo.findOne({
                where: { id: Number(id) },
                relations: ["sale"],
            });
            if (!payment) {
                return res.status(404).json({ message: "Payment not found" });
            }
            return res.status(200).json(payment);
        }
        catch (error) {
            console.error("Get payment error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // GET PAYMENTS BY SALE
    static async getPaymentsBySale(req, res) {
        try {
            const { saleId } = req.params;
            const paymentRepo = data_source_1.AppDataSource.getRepository(Payment_1.Payment);
            const payments = await paymentRepo.find({
                where: { sale: { id: Number(saleId) } },
                order: { paymentDate: "ASC" },
            });
            return res.status(200).json(payments);
        }
        catch (error) {
            console.error("Get sale payments error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // DELETE PAYMENT (optional)
    static async deletePayment(req, res) {
        try {
            const { id } = req.params;
            const paymentRepo = data_source_1.AppDataSource.getRepository(Payment_1.Payment);
            const payment = await paymentRepo.findOneBy({ id: Number(id) });
            if (!payment) {
                return res.status(404).json({ message: "Payment not found" });
            }
            await paymentRepo.remove(payment);
            return res.status(200).json({
                message: "Payment deleted successfully",
            });
        }
        catch (error) {
            console.error("Delete payment error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.PaymentController = PaymentController;
