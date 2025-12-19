// src/entities/User.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { Sale } from "./Sale";

export enum UserRole {
  ADMIN = "admin",
  CUSTOMER = "customer",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullName!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role!: UserRole;

  @OneToMany(() => Sale, (sale) => sale.customer)
  sales!: Sale[];
}
