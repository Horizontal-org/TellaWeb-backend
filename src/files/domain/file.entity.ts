import { Report } from 'reports/domain/report.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  fileName: string;

  @Column()
  bucket: string;

  @ManyToOne(() => Report, (report: Report) => report.files)
  report: Report;
}
