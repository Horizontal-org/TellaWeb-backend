import { Exclude, Expose } from 'class-transformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ReportEntity } from 'modules/report/domain/report.entity';

import { RolesUser } from './roles.user.enum';

@Exclude()
@Entity()
export class UserEntity {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Expose()
  @Column({ length: 40 })
  username: string;

  @Column()
  password: string;

  @Column()
  role: RolesUser;

  @OneToMany(() => ReportEntity, (report: ReportEntity) => report.author)
  reports: ReportEntity[];
}
