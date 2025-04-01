import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Card } from '@src/card/entities/card.entity';
import { Category } from '@src/category/entities/category.entity';
import { Transaction } from '@src/transaction/entities/transaction.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  active: boolean;

  @OneToMany(() => Card, card => card.user)
  cards: Card[];

  @OneToMany(() => Category, category => category.user)
  categories: Category[];

  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions: Transaction[];

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}