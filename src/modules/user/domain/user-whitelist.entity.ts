import { Expose } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UserEntity } from '.';

@Entity("user_whitelists")
export class UserWhitelistEntity {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  location : string;

  @Expose()
  @Column({ name: 'created_at' })
  createdAt!: Date;
  
  @Expose()
  @ManyToOne(() => UserEntity, user => user.locations)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @BeforeInsert()
  private beforeInsert(): void {
    this.createdAt = new Date();
  }

}
