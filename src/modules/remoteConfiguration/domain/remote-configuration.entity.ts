import {
  BeforeInsert,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Exclude, Expose } from 'class-transformer';

@Exclude()
@Entity()
export class RemoteConfigurationEntity {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Expose()
  @Column()
  shortCode: string;

  @Expose()
  @Column()
  name: string;

  @Expose()
  @Column('simple-array')
  applock: boolean[];

  @Expose()
  @Column('simple-array')
  camoflage: boolean[];

  @Expose()
  @Column()
  defaultUser?: string;

  @Expose()
  @Column()
  apiUrl?: string;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @BeforeInsert()
  private beforeInsert(): void {
    this.createdAt = new Date();
  }
}
