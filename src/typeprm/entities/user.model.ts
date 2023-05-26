import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Code } from './code.model';
import { Property } from './property.model';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, nullable: false })
  username: string;

  @Column({ nullable: false })
  password: string;

  @Column({ unique: true, nullable: false })
  number: number;
  @OneToMany(() => Code, (code) => code.user)
  codes: Code[];
  @OneToMany(() => Property, (property) => property.user)
  properties: Property[];
}
