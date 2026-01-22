"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthController {
    // REGISTER
    static async register(req, res) {
        try {
            const { fullName, email, password } = req.body;
            if (!fullName || !email || !password) {
                return res.status(400).json({ message: "All fields are required" });
            }
            const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
            const existingUser = await userRepo.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({ message: "Email already in use" });
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const user = userRepo.create({
                fullName,
                email,
                password: hashedPassword,
                role: User_1.UserRole.CUSTOMER,
            });
            await userRepo.save(user);
            return res.status(201).json({
                message: "User registered successfully",
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                },
            });
        }
        catch (error) {
            return res.status(500).json({ message: "Registration failed", error });
        }
    }
    // LOGIN
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Email and password required" });
            }
            const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
            const user = await userRepo.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            const isMatch = await bcryptjs_1.default.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ message: "Invalid credentials" });
            }
            const token = jsonwebtoken_1.default.sign({
                id: user.id,
                role: user.role,
            }, process.env.JWT_SECRET, { expiresIn: "1d" });
            return res.json({
                message: "Login successful",
                token,
                user: {
                    id: user.id,
                    fullName: user.fullName,
                    email: user.email,
                    role: user.role,
                },
            });
        }
        catch (error) {
            console.error("LOGIN ERROR:", error);
            return res.status(500).json({
                message: "Login failed",
                error: error instanceof Error ? error.message : error,
            });
        }
    }
}
exports.AuthController = AuthController;
