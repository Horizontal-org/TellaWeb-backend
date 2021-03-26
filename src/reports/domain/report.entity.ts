import { Transform } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { mapReportFiles } from '../utils/mapReportFiles.utils';
import { ReportFile } from './report-files.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 150 })
  title: string;

  @Column({ length: 400 })
  description: string;

  @Transform(mapReportFiles)
  @OneToMany(() => ReportFile, (reportFile) => reportFile.report, {
    cascade: true,
    eager: true,
  })
  files: ReportFile[];
}
