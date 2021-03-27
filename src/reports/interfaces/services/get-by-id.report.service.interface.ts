import { ReportDomain } from 'reports/domain/report.domain';

export interface IGetByIdReportService {
  execute(id: string): Promise<ReportDomain>;
}
