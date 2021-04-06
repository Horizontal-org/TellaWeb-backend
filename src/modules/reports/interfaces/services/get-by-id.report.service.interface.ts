import { ReportEntity } from '../../domain';

export interface IGetByIdReportService {
  execute(id: string): Promise<ReportEntity>;
}
