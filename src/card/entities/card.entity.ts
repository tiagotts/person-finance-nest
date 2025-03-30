import { User } from "@src/user/entities/user.entity";
import { Column, Entity } from "typeorm";

@Entity({ name: "card" })
export class Card extends User{

    @Column()
    card_number: string;
    
    @Column()
    credit_limit: number;
    
    @Column()
    day_payment: number;
    
}
