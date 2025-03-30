import { Card } from "@src/card/entities/card.entity";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'user', schema: 'personfinance' })  // Added specific table name
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    email: string;
    
    @Column()
    password: string;
    
    @CreateDateColumn()
    createdAt: Date;
    
    @CreateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Card, (card) => card.user)
    cards: Card[];
}
