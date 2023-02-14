import { Exclude, Expose } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { ReportEntity } from 'modules/report/domain/report.entity';

import { RolesUser } from './roles.user.enum';
import { EditUserDto } from '../dto/edit.user.dto';
import { ProjectEntity } from 'modules/project/domain/project.entity';
import { UserEntity } from '.';

@Entity("recovery_keys")
export class RecoveryKeyEntity {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  code: string;

  @Expose()
  @Column({ name: 'created_at' })
  createdAt!: Date;
  
  @ManyToOne(() => UserEntity, user => user.recovery_keys)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @BeforeInsert()
  private beforeInsert(): void {
    this.createdAt = new Date();
  }

}
