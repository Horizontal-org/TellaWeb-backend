import { Report } from 'reports/domain/report.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserId } from './user-id.dv';
import { UserRoles } from './user-roles.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: UserId;

  @Column({ length: 40 })
  username: string;

  @Column()
  password: string;

  @Column()
  role: UserRoles;

  @OneToMany(() => Report, (report: Report) => report.author)
  reports: Report[];
}
