import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

import { FileEntity } from 'modules/file/domain/file.entity';
import { UserEntity } from 'modules/user/domain/user.entity';

@Entity()
export class ReportEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  title: string;

  @Column({ length: 400 })
  description: string;

  @OneToMany(() => FileEntity, (file: FileEntity) => file.report, {
    cascade: true,
    eager: true,
  })
  files: FileEntity[];

  @ManyToOne(() => UserEntity, (user: UserEntity) => user.reports, {
    eager: true,
  })
  author: UserEntity;
}
