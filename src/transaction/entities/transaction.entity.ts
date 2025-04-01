import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '@src/user/entities/user.entity';
import { Card } from '@src/card/entities/card.entity';
import { Category } from '@src/category/entities/category.entity';

@Entity('transactions')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column()
  date: Date;

  @Column({ type: 'int' })
  installments: number;

  @Column({ type: 'int', nullable: true })
  currentInstallment: number;

  @ManyToOne(() => Card, card => card.transactions)
  card: Card;

  @Column()
  cardId: string;

  @ManyToOne(() => Category, category => category.transactions)
  category: Category;

  @Column()
  categoryId: string;

  @ManyToOne(() => User, user => user.transactions)
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}