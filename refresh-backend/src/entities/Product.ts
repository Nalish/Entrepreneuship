// src/entities/Product.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { Stock } from "./Stock";
import { SaleItem } from "./SaleItem";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column("decimal", { precision: 10, scale: 2 })
  price!: number;

  @OneToMany(() => Stock, (stock) => stock.product)
  stock!: Stock[];

  @OneToMany(() => SaleItem, (item) => item.product)
  saleItems!: SaleItem[];
}
