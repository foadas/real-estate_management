import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from './user.model';

@Entity({ name: 'properties' })
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  location: string;

  @Column({ nullable: false })
  size: string;
  @ManyToOne(() => User, (user) => user.properties)
  user: User;
}
