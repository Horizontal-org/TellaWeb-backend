export interface IDeleteByIdReportApplication {
  execute(reportId: string): Promise<boolean>;
}
