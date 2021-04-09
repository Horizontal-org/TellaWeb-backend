import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ReportEntity } from 'modules/report/domain/report.entity';
import { Exclude, Expose } from 'class-transformer';

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

  public attachToReport(reportId: string) {
    const report = new ReportEntity();
    report.id = reportId;
    this.report = report;
  }
}
