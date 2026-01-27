import "reflect-metadata";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { AppDataSource } from "./data-source";

import authRoutes from "./routes/authRoutes";
import productRoutes from "./routes/productRoutes";
import branchRoutes from "./routes/branchRoutes";
import paymentRoutes from "./routes/paymentRoutes";
import saleItemRoutes from "./routes/saleItemRoutes";
import saleRoutes from "./routes/saleRoutes";
import stockRoutes from "./routes/stockRoutes";
import userRoutes from "./routes/userRoutes";
import checkoutRoutes from "./routes/checkoutRoutes";

dotenv.config();

const app = express();

// ✅ BASIC MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ CORS (works on localhost + Render)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// ✅ PORT (Render sets this automatically)
const PORT = process.env.PORT || 3001;

// ✅ ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/branch", branchRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/item", saleItemRoutes);
app.use("/api/sale", saleRoutes);
app.use("/api/stock", stockRoutes);
app.use("/api/user", userRoutes);
app.use("/api/checkout", checkoutRoutes);

// ✅ START SERVER FIRST (important for Render)
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ✅ CONNECT DATABASE (after server starts)
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected successfully");
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
  });
