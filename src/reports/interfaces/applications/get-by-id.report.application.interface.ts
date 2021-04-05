import { Report } from 'reports/domain/report.entity';

export interface IGetByIdReportApplication {
  execute(id: string): Promise<Report>;
}
