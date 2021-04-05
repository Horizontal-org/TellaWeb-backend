import { Report } from 'reports/domain/report.entity';

export interface IGetByIdReportService {
  execute(id: string): Promise<Report>;
}
