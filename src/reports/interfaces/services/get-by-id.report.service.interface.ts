import { ReportDomain } from 'src/reports/domain/report.domain';

export interface IGetByIdReportService {
  execute(id: string): Promise<ReportDomain>;
}
