import "reflect-metadata"
import dotenv from "dotenv"
import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import { AppDataSource } from "./data-source"
import authRoutes from "../src/routes/authRoutes"
import productRoutes from "../src/routes/productRoutes"
import branchRoutes from "./routes/branchRoutes"
import paymentRoutes from "./routes/paymentRoutes"
import saleItemRoutes from "./routes/saleItemRoutes"
import saleRoutes from "./routes/saleRoutes"
import stockRoutes from "./routes/stockRoutes"
import userRoutes from './routes/userRoutes'


//configure the dotenv
dotenv.config()

//instance of express
const app=express()

//middlewares
app.use(express.json())//for parsing application/json3
app.use(express.urlencoded({extended:true}))// for parsing application/x-www-form-urlencoded
app.use(cookieParser()) || 3001

//CORS configuration
app.use(cors({
    origin:"http://localhost:5173",
    methods:"GET,PUT,DELETE,POST,PATCH",
    credentials:true
}))




const port =process.env.PORT 
//initialise database connection
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connected successfully");

    app.use("/api/auth",authRoutes)
    app.use("/api/products",productRoutes)
    app.use("/api/branch",branchRoutes)
    app.use("/api/payment",paymentRoutes)
    app.use("/api/item",saleItemRoutes)
    app.use("/api/sale",saleRoutes)
    app.use("/api/stock",stockRoutes)
    app.use("/api/user",userRoutes)
    
   
    

    app.listen(3001, () => {
      console.log("🚀 Server running on port 3001");
    });
  })
  .catch((error:any) => {
    console.error("Database connection failed:", error);
  });