"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewMigrationName1766042496566 = void 0;
const typeorm_1 = require("typeorm");
class NewMigrationName1766042496566 {
    async up(queryRunner) {
        /* ===================== USERS ===================== */
        await queryRunner.createTable(new typeorm_1.Table({
            name: "user",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                { name: "fullName", type: "varchar" },
                { name: "email", type: "varchar", isUnique: true },
                { name: "password", type: "varchar" },
                {
                    name: "role",
                    type: "enum",
                    enum: ["admin", "customer"],
                    default: "'customer'",
                },
            ],
        }));
        /* ===================== BRANCH ===================== */
        await queryRunner.createTable(new typeorm_1.Table({
            name: "branch",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                { name: "name", type: "varchar" },
                { name: "location", type: "varchar" },
            ],
        }));
        /* ===================== PRODUCT ===================== */
        await queryRunner.createTable(new typeorm_1.Table({
            name: "product",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                { name: "name", type: "varchar" },
                {
                    name: "price",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
                },
            ],
        }));
        /* ===================== SALE ===================== */
        await queryRunner.createTable(new typeorm_1.Table({
            name: "sale",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "saleDate",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                },
                {
                    name: "totalAmount",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
                },
                { name: "customerId", type: "int" },
                { name: "branchId", type: "int" },
            ],
        }));
        /* ===================== SALE ITEM ===================== */
        await queryRunner.createTable(new typeorm_1.Table({
            name: "sale_item",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                { name: "quantity", type: "int" },
                {
                    name: "unitPrice",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
                },
                { name: "saleId", type: "int" },
                { name: "productId", type: "int" },
            ],
        }));
        /* ===================== PAYMENT ===================== */
        await queryRunner.createTable(new typeorm_1.Table({
            name: "payment",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                {
                    name: "amount",
                    type: "decimal",
                    precision: 10,
                    scale: 2,
                },
                {
                    name: "method",
                    type: "enum",
                    enum: ["cash", "mpesa", "card"],
                },
                {
                    name: "paymentDate",
                    type: "timestamp",
                    default: "CURRENT_TIMESTAMP",
                },
                { name: "saleId", type: "int" },
            ],
        }));
        /* ===================== STOCK ===================== */
        await queryRunner.createTable(new typeorm_1.Table({
            name: "stock",
            columns: [
                {
                    name: "id",
                    type: "int",
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: "increment",
                },
                { name: "quantity", type: "int" },
                { name: "productId", type: "int" },
                { name: "branchId", type: "int" },
            ],
        }));
        /* ===================== FOREIGN KEYS ===================== */
        // Sale -> User
        await queryRunner.createForeignKey("sale", new typeorm_1.TableForeignKey({
            columnNames: ["customerId"],
            referencedTableName: "user",
            referencedColumnNames: ["id"],
        }));
        // Sale -> Branch
        await queryRunner.createForeignKey("sale", new typeorm_1.TableForeignKey({
            columnNames: ["branchId"],
            referencedTableName: "branch",
            referencedColumnNames: ["id"],
        }));
        // SaleItem -> Sale
        await queryRunner.createForeignKey("sale_item", new typeorm_1.TableForeignKey({
            columnNames: ["saleId"],
            referencedTableName: "sale",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
        }));
        // SaleItem -> Product
        await queryRunner.createForeignKey("sale_item", new typeorm_1.TableForeignKey({
            columnNames: ["productId"],
            referencedTableName: "product",
            referencedColumnNames: ["id"],
        }));
        // Payment -> Sale
        await queryRunner.createForeignKey("payment", new typeorm_1.TableForeignKey({
            columnNames: ["saleId"],
            referencedTableName: "sale",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
        }));
        // Stock -> Product
        await queryRunner.createForeignKey("stock", new typeorm_1.TableForeignKey({
            columnNames: ["productId"],
            referencedTableName: "product",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
        }));
        // Stock -> Branch
        await queryRunner.createForeignKey("stock", new typeorm_1.TableForeignKey({
            columnNames: ["branchId"],
            referencedTableName: "branch",
            referencedColumnNames: ["id"],
            onDelete: "CASCADE",
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("stock");
        await queryRunner.dropTable("payment");
        await queryRunner.dropTable("sale_item");
        await queryRunner.dropTable("sale");
        await queryRunner.dropTable("product");
        await queryRunner.dropTable("branch");
        await queryRunner.dropTable("user");
    }
}
exports.NewMigrationName1766042496566 = NewMigrationName1766042496566;
