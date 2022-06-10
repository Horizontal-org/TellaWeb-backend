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
  shortCode?: string;

  @Expose()
  @Column()
  name: string;

  @Expose()
  @Column({
    type: 'simple-json',
  })
  camouflage: {
    visible: boolean, 
    change_name: boolean, 
    calculator: boolean
  };

  @Expose()
  @Column({
    type: 'simple-json',
  })
  crashReports: {
    visible: boolean, 
    enabled: boolean
  };

  @Expose()
  @Column()
  serversVisible: boolean;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @BeforeInsert()
  private beforeInsert(): void {
    this.createdAt = new Date();
  }
}
