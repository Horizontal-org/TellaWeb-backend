import {
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ReportEntity } from 'modules/report/domain/report.entity';
import { Exclude, Expose } from 'class-transformer';
import { FileType } from './file-type.file.enum';

@Exclude()
@Entity()
export class FileEntity {
  @Expose()
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Expose()
  @Column()
  fileName: string;

  @Column()
  bucket: string;

  @ManyToOne(() => ReportEntity, (report: ReportEntity) => report.files)
  report: ReportEntity;

  @Expose()
  @Column({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column()
  type: FileType = FileType.OTHER;

  @Expose()
  @Column({ type: 'simple-json', nullable: true })
  fileInfo: unknown;

  @BeforeInsert()
  private beforeInsert(): void {
    this.createdAt = new Date();
  }

  public attachToReport(reportId: string) {
    const report = new ReportEntity();
    report.id = reportId;
    this.report = report;
  }
}
