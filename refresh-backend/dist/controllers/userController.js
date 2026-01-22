"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
class UserController {
    // CREATE USER
    static async createUser(req, res) {
        try {
            const { fullName, email, password, role } = req.body;
            if (!fullName || !email || !password) {
                return res.status(400).json({ message: "Missing required fields" });
            }
            const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
            const existingUser = await userRepo.findOneBy({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email already in use" });
            }
            const hashedPassword = await bcryptjs_1.default.hash(password, 10);
            const user = userRepo.create({
                fullName,
                email,
                password: hashedPassword,
                role: role ?? User_1.UserRole.CUSTOMER,
            });
            await userRepo.save(user);
            // Remove password from response
            const { password: _, ...safeUser } = user;
            return res.status(201).json({
                message: "User created successfully",
                user: safeUser,
            });
        }
        catch (error) {
            console.error("Create user error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // GET ALL USERS
    static async getAllUsers(req, res) {
        try {
            const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
            const users = await userRepo.find({
                relations: ["sales"],
            });
            const safeUsers = users.map(({ password, ...user }) => user);
            return res.status(200).json(safeUsers);
        }
        catch (error) {
            console.error("Get users error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // GET USER BY ID
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
            const user = await userRepo.findOne({
                where: { id: Number(id) },
                relations: ["sales"],
            });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            const { password, ...safeUser } = user;
            return res.status(200).json(safeUser);
        }
        catch (error) {
            console.error("Get user error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // UPDATE USER
    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { fullName, email, password, role } = req.body;
            const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
            const user = await userRepo.findOneBy({ id: Number(id) });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            if (fullName !== undefined)
                user.fullName = fullName;
            if (email !== undefined)
                user.email = email;
            if (role !== undefined)
                user.role = role;
            if (password) {
                user.password = await bcryptjs_1.default.hash(password, 10);
            }
            await userRepo.save(user);
            const { password: _, ...safeUser } = user;
            return res.status(200).json({
                message: "User updated successfully",
                user: safeUser,
            });
        }
        catch (error) {
            console.error("Update user error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
    // DELETE USER
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
            const user = await userRepo.findOne({
                where: { id: Number(id) },
                relations: ["sales"],
            });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            if (user.sales.length > 0) {
                return res.status(400).json({
                    message: "Cannot delete user with existing sales",
                });
            }
            await userRepo.remove(user);
            return res.status(200).json({
                message: "User deleted successfully",
            });
        }
        catch (error) {
            console.error("Delete user error:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}
exports.UserController = UserController;
