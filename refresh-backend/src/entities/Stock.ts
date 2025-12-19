// src/entities/Stock.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from "typeorm";
import { Product } from "./Product";
import { Branch } from "./Branch";

@Entity()
export class Stock {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  quantity!: number;

  @ManyToOne(() => Product, (product) => product.stock, {
    onDelete: "CASCADE",
  })
  product!: Product;

  @ManyToOne(() => Branch, (branch) => branch.stock, {
    onDelete: "CASCADE",
  })
  branch!: Branch;
}
