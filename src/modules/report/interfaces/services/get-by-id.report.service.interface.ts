import { ReportEntity } from '../../domain';

export interface IGetByIdReportService {
  execute(reportId: string): Promise<ReportEntity>;
}
