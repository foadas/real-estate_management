import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.model';

@Entity({ name: 'ticket' })
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  subject: string;

  @Column({ nullable: false })
  body: string;

  @Column({ nullable: false })
  date: Date;
  @ManyToOne(() => User, (user) => user.tickets)
  user: User;
}
