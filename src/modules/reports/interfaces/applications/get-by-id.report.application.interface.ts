import { ReadReportDto } from '../../dto';

export interface IGetByIdReportApplication {
  execute(reportId: string): Promise<ReadReportDto>;
}
