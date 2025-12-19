require("ts-node").register({
  transpileOnly: true,
});
require("dotenv").config();
const { DataSource } = require("typeorm");
const path = require("path");

module.exports = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  entities: [path.join(__dirname, "src/entities/**/*.ts")],
  migrations: [path.join(__dirname, "src/migrations/**/*.ts")],
});
