export interface IDeleteByIdReportService {
  execute(reportId: string): Promise<boolean>;
}
