// src/entities/Sale.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Branch } from "./Branch";
import { SaleItem } from "./SaleItem";
import { Payment } from "./Payment";

@Entity()
export class Sale {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  saleDate!: Date;

  @Column("decimal", { precision: 10, scale: 2 })
  totalAmount!: number;

  @ManyToOne(() => User, (user) => user.sales)
  customer!: User;

  @ManyToOne(() => Branch, (branch) => branch.sales)
  branch!: Branch;

  @OneToMany(() => SaleItem, (item) => item.sale, {
    cascade: true,
  })
  items!: SaleItem[];

  @OneToMany(() => Payment, (payment) => payment.sale)
  payments!: Payment[];
}
