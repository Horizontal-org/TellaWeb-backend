import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  UpdateDateColumn,
  BeforeInsert,
  BeforeRemove,
} from 'typeorm';

import { FileEntity } from 'modules/file/domain/file.entity';
import { UserEntity } from 'modules/user/domain/user.entity';
import { EditReportDto } from '../dto/edit.report.dto';

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
    onDelete: 'CASCADE',
  })
  author: UserEntity;

  @Column({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @BeforeInsert()
  private beforeInsert(): void {
    this.createdAt = new Date();
  }

  public update(editReportDto: EditReportDto) {
    this.title = editReportDto.title || this.title;
    this.description = editReportDto.description || this.description;
  }
}
