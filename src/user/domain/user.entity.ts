import { Transform } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserId } from './user-id.dv';
import { UserReport } from './user-report.entity';
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

  @Transform(({ value }) => value.report)
  @OneToMany(() => UserReport, (userReport) => userReport.user, {
    cascade: true,
    eager: true,
  })
  reports: UserReport[];
}
