import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { ReportEntity } from 'modules/reports/domain/report.entity';
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
}
