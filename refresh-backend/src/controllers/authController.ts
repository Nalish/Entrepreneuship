import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User, UserRole } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class AuthController {
  // REGISTER
  static async register(req: Request, res: Response) {
    try {
      const { fullName, email, password } = req.body;

      if (!fullName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      const userRepo = AppDataSource.getRepository(User);

      const existingUser = await userRepo.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = userRepo.create({
        fullName,
        email,
        password: hashedPassword,
        role: UserRole.CUSTOMER,
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
    } catch (error) {
      return res.status(500).json({ message: "Registration failed", error });
    }
  }

  // LOGIN
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const userRepo = AppDataSource.getRepository(User);

      const user = await userRepo.findOne({ where: { email } });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          id: user.id,
          role: user.role,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "1d" }
      );

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
    } catch (error) {
  console.error("LOGIN ERROR:", error);
  return res.status(500).json({
    message: "Login failed",
    error: error instanceof Error ? error.message : error,
  });
}

  }
}
