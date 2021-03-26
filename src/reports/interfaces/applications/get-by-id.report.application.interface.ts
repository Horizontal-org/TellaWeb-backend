import { ReportDomain } from 'src/reports/domain/report.domain';

export interface IGetByIdReportApplication {
  execute(id: string): Promise<ReportDomain>;
}
