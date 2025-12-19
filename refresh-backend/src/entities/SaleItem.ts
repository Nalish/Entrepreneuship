// src/entities/SaleItem.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { Sale } from "./Sale";
import { Product } from "./Product";

@Entity()
export class SaleItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  quantity!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  unitPrice!: number;

  @ManyToOne(() => Sale, (sale) => sale.items, {
    onDelete: "CASCADE",
  })
  sale!: Sale;

  @ManyToOne(() => Product, (product) => product.saleItems)
  product!: Product;
}
