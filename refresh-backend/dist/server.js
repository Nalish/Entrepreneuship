"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const data_source_1 = require("./data-source");
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const branchRoutes_1 = __importDefault(require("./routes/branchRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const saleItemRoutes_1 = __importDefault(require("./routes/saleItemRoutes"));
const saleRoutes_1 = __importDefault(require("./routes/saleRoutes"));
const stockRoutes_1 = __importDefault(require("./routes/stockRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const checkoutRoutes_1 = __importDefault(require("./routes/checkoutRoutes"));
//configure the dotenv
dotenv_1.default.config();
//instance of express
const app = (0, express_1.default)();
//middlewares
app.use(express_1.default.json()); //for parsing application/json3
app.use(express_1.default.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use((0, cookie_parser_1.default)()) || 3001;
//CORS configuration
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: "GET,PUT,DELETE,POST,PATCH",
    credentials: true
}));
const port = process.env.PORT;
//initialise database connection
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("✅ Database connected successfully");
    app.use("/api/auth", authRoutes_1.default);
    app.use("/api/products", productRoutes_1.default);
    app.use("/api/branch", branchRoutes_1.default);
    app.use("/api/payment", paymentRoutes_1.default);
    app.use("/api/item", saleItemRoutes_1.default);
    app.use("/api/sale", saleRoutes_1.default);
    app.use("/api/stock", stockRoutes_1.default);
    app.use("/api/user", userRoutes_1.default);
    app.use("/api/checkout", checkoutRoutes_1.default);
    app.listen(3001, () => {
        console.log("🚀 Server running on port 3001");
    });
})
    .catch((error) => {
    console.error("Database connection failed:", error);
});
