import { Exclude, Expose } from 'class-transformer';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  ManyToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  BeforeRemove,
} from 'typeorm';

import { ReportEntity } from 'modules/report/domain/report.entity';

import { RolesUser } from './roles.user.enum';
import { EditUserDto } from '../dto/edit.user.dto';
import { ProjectEntity } from 'modules/project/domain/project.entity';
import { textChangeRangeIsUnchanged } from 'typescript';
import { RecoveryKeyEntity } from './recovery-key.entity';
import { UserVerificationCodeEntity } from './user-verification-code.entity';
import { UserWhitelistEntity } from './user-whitelist.entity';

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

  @Column({ nullable: true })
  otp_secret: string;

  @Column()
  otp_active: boolean;

  @Column()
  blocked: boolean;

  @Expose()
  @Column({ name: 'created_at' })
  createdAt!: Date;

  @Expose()
  @Column({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @OneToMany(() => UserVerificationCodeEntity, (user_verification: UserVerificationCodeEntity) => user_verification.user)
  @JoinColumn({ name: "user_id" })
  verification_code: UserVerificationCodeEntity;

  @OneToMany(() => UserWhitelistEntity, (user_whitelist: UserWhitelistEntity) => user_whitelist.user)
  @JoinColumn({ name: "user_id" })
  locations: UserWhitelistEntity[];


  @OneToMany(() => ReportEntity, (report: ReportEntity) => report.author)
  reports: ReportEntity[];

  @OneToMany(() => RecoveryKeyEntity, (rec_key: RecoveryKeyEntity) => rec_key.user)
  @JoinColumn({ name: "user_id" })
  recovery_keys: RecoveryKeyEntity[];

  @ManyToMany(() => ProjectEntity, project => project.users, {
    onDelete: 'CASCADE'
  })
  projects: ProjectEntity[];

  @BeforeInsert()
  private beforeInsert(): void {
    this.createdAt = new Date();
  }

  public update(editUserDto: EditUserDto) {
    this.password = editUserDto.password || this.password;
    this.username = editUserDto.username || this.username;
    this.note = editUserDto.note || this.note;
    this.role = editUserDto.role || this.role;
  }

  public refreshOtpSecret(otp_secret) {
    this.otp_secret = otp_secret
  }

  public setOtpActive(value) {
    this.otp_active = value
  }
}
