import { DataSource } from "typeorm";
import "dotenv/config";


export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,

  // 🚫 Force NO SSL for local/dev
  ssl: false,
  extra: { ssl: false },

  synchronize: false,
  logging: true,

  entities: ["src/entities/**/*.ts"],
  migrations: ["src/migrations/**/*.ts"],
});
