import { File } from '../../files/domain/file.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Report } from './report.entity';

@Entity()
export class ReportFile {
  @PrimaryGeneratedColumn('uuid')
  readonly id: string;

  @ManyToOne(() => Report)
  report: Report;

  @ManyToOne(() => File, { eager: true })
  file: File;
}
