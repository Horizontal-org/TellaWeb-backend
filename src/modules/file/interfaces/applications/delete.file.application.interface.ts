export interface IDeleteFileApplication {
  execute(fileId: string, reportId: string): Promise<boolean>;
}
