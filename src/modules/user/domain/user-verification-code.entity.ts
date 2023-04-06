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

@Entity("user_verification_codes")
export class UserVerificationCodeEntity {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  code: string;

  @Expose()
  @Column({ name: 'created_at' })
  createdAt!: Date;
  
  @Expose()
  @Column({ name: 'expires_at' })
  expiresAt!: Date;
  
  @Expose()
  @ManyToOne(() => UserEntity, user => user.verification_code)
  @JoinColumn({ name: "user_id" })
  user: UserEntity;

  @BeforeInsert()
  private beforeInsert(): void {
    this.createdAt = new Date();
  }

}
