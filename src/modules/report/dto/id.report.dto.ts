import { Exclude, Expose } from 'class-transformer';
import { IsUUID } from 'class-validator';

@Exclude()
export class IdReportDto {
  constructor(reportId: string) {
    this.id = reportId;
  }

  @Expose()
  @IsUUID('4')
  id: string;
}
