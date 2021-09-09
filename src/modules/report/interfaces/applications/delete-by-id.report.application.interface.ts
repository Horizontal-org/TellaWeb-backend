export interface IDeletedByIdReportApplication {
  execute(reportId: string): Promise<boolean>;
}
