import {
  AfterInsert,
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class Story {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  userId: number;

  @Column()
  filename: string;

  @Column()
  format: string;

  @CreateDateColumn({ type: 'timestamp' })
  creationTime: Date;

  @Column({ type: 'boolean', default: false })
  isRemoved: boolean;

  @Column({ type: 'timestamp', nullable: true })
  expirationTime: Date;
}
