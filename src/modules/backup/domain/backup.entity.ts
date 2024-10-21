import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ReportEntity } from 'modules/report/domain/report.entity';
import { Exclude, Expose } from 'class-transformer';
import { ProjectEntity } from 'modules/project/domain';
import { UserEntity } from 'modules/user/domain';

@Exclude()
@Entity("backups")
export class BackupEntity {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @ManyToOne(() => UserEntity, user => user.backups)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;


  @Expose()
  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Expose()
  @Column()
  status: string;

  @BeforeInsert()
  private beforeInsert(): void {
    this.createdAt = new Date();
  }
}
