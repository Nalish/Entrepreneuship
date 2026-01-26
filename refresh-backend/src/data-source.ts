import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import path from "path"

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  synchronize: false, // ALWAYS false when using migrations
  logging: false,

  // ✅ Load entities by path (no imports)
  entities: [path.join(__dirname, "/entities/**/*.ts")],

  // ✅ Load migrations by path
  migrations: ["dist/migrations/**/*.js"],
});
