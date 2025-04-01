import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '@src/user/entities/user.entity';
import { Transaction } from '@src/transaction/entities/transaction.entity';
import { ImportFile } from '@src/import/entities/import-file.entity';

@Entity('cards')
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  number: string;

  @Column()
  expirationDate: Date;

  @Column()
  closingDay: number;

  @Column()
  dueDay: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  limit: number;

  @Column({ default: true })
  active: boolean;

  @ManyToOne(() => User, user => user.cards)
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Transaction, transaction => transaction.card)
  transactions: Transaction[];

  @OneToMany(() => ImportFile, importFile => importFile.card)
  imports: ImportFile[];
}