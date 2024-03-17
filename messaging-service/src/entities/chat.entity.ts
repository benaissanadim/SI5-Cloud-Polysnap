import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Chat {
    @PrimaryGeneratedColumn()
    id : number;

    @Column()
    name: string;

    @Column('jsonb', { default: [] })
    participants: number[];
}