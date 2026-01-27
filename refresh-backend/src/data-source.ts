import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "postgres",
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  synchronize: true, // only for development
  logging: false,
  entities: ["dist/entities/*.js"],
  migrations: ["dist/migrations/*.js"],
});
