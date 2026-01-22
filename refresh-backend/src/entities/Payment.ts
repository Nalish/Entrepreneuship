// src/entities/Payment.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from "typeorm";
import { Sale } from "./Sale";

export enum PaymentMethod {
  CASH = "cash",
  MPESA = "mpesa",
  CARD = "card",
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("decimal", { precision: 10, scale: 2 })
  amount!: number;

  @Column({
    type: "enum",
    enum: PaymentMethod,
  })
  method!: PaymentMethod;

  @CreateDateColumn()
  paymentDate!: Date;

  @Column({ type: "varchar", nullable: true, unique: true })
  mpesaCheckoutRequestId?: string;

  @Column({ type: "varchar", nullable: true })
  mpesaMerchantRequestId?: string;

  @ManyToOne(() => Sale, (sale) => sale.payments, {
    onDelete: "CASCADE",
  })
  sale!: Sale;
}
