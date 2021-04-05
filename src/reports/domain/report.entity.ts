import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { File } from 'files/domain/file.entity';
import { User } from 'user/domain/user.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  title: string;

  @Column({ length: 400 })
  description: string;

  @OneToMany(() => File, (file: File) => file.report, {
    cascade: true,
    eager: true,
  })
  files: File[];

  @ManyToOne(() => User, (user: User) => user.reports, {
    eager: true,
  })
  author: User;
}
