import { Exclude, Expose } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { ReportEntity } from 'modules/report/domain/report.entity';

import { RolesUser } from './roles.user.enum';
import { EditUserDto } from '../dto/edit.user.dto';

@Exclude()
@Entity()
export class UserEntity {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Expose()
  @Column({ length: 80 })
  username: string;

  @Column()
  password: string;

  @Column()
  role: RolesUser;

  @Column({ nullable: true })
  note: string;

  @Expose()
  @Column({ name: 'created_at' })
  createdAt!: Date;

  @OneToMany(() => ReportEntity, (report: ReportEntity) => report.author)
  reports: ReportEntity[];

  @BeforeInsert()
  private beforeInsert(): void {
    this.createdAt = new Date();
  }

  public update(editUserDto: EditUserDto) {
    this.role = editUserDto.isAdmin ? RolesUser.ADMIN : RolesUser.REPORTER;
    this.password = editUserDto.password || this.password;
    this.username = editUserDto.username || this.username;
    this.note = editUserDto.note || this.note;
  }
}
