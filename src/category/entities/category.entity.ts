import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, Tree, TreeChildren, TreeParent } from 'typeorm';
import { User } from '@src/user/entities/user.entity';
import { Transaction } from '@src/transaction/entities/transaction.entity';

@Entity('categories')
@Tree('closure-table')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  active: boolean;

  @TreeChildren()
  children: Category[];

  @TreeParent()
  parent: Category;

  @ManyToOne(() => User, user => user.categories)
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Transaction, transaction => transaction.category)
  transactions: Transaction[];
}