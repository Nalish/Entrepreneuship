// src/entities/Branch.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { Stock } from "./Stock";
import { Sale } from "./Sale";

@Entity()
export class Branch {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  location!: string;

  // src/entities/Branch.ts
@Column({ default: false })
isHQ!: boolean;


  @OneToMany(() => Stock, (stock) => stock.branch)
  stock!: Stock[];

  @OneToMany(() => Sale, (sale) => sale.branch)
  sales!: Sale[];
}
