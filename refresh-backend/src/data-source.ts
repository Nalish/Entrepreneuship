import { DataSource } from "typeorm";
import "dotenv/config";

const isProd = process.env.NODE_ENV === "production";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,

  ssl: isProd ? { rejectUnauthorized: false } : false,
  extra: isProd ? { ssl: { rejectUnauthorized: false } } : {},

  synchronize: false,
  logging: true,

  entities: isProd ? ["dist/entities/**/*.js"] : ["src/entities/**/*.ts"],
  migrations: isProd ? ["dist/migrations/**/*.js"] : ["src/migrations/**/*.ts"],
});
