import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity({ name: 'card', schema: 'personfinance' })
export class Card {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  cardNumber: string;

  @Column()
  cardHolderName: string;

  @Column()
  expirationDate: Date;

  @Column()
  cvv: string;

  @Column()
  brand: string;

  @Column({ default: true })
  isActive: boolean;

  @Column()
  limit: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.cards)
  @JoinColumn({ name: 'userId' })
  user: User;
}