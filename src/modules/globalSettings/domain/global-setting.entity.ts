import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Exclude, Expose } from 'class-transformer';

@Exclude()
@Entity("global_settings")
export class GlobalSettingEntity {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id?: string;


  @Expose()
  @Column()
  name: string;

  @Expose()
  @Column()
  enabled: boolean;

  @Expose()
  @Column({ name: 'created_at' })
  createdAt!: Date;

  @BeforeInsert()
  private beforeInsert(): void {
    this.createdAt = new Date();
  }
}
