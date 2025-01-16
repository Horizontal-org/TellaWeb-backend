import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Exclude, Expose } from 'class-transformer';
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
  @Column({ name: 'folder_name' })
  folderName: string;
  
  @Expose()
  @Column()
  status: string;
  
  @Expose()
  @Column({ name: 'created_at' })
  createdAt!: Date;
}
