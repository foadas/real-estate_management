import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.model';

@Entity({ name: 'codes' })
export class Code {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  code: number;

  @Column({ nullable: true, default: false })
  is_used: boolean;

  @ManyToOne(() => User, (user) => user.codes)
  user: User;
}
