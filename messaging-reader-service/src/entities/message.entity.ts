import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  chatId: number;

  @Column()
  senderId: string;

  @Column()
  content: string;

  @Column('jsonb')
  attachment: {
    type: string;
    name: string;
    link: string;
  };

  @Column({ default: false })
  expiring: boolean;

  @Column({ default: null, nullable: true })
  expirationTime: number;

  @CreateDateColumn({ type: 'timestamp' ,default : new Date()})
  date: Date;

  @Column('jsonb', { default: [] })
  seenBy: number[];

}