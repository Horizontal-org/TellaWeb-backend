import { ReportDomain } from 'reports/domain/report.domain';

export interface IGetByIdReportApplication {
  execute(id: string): Promise<ReportDomain>;
}
