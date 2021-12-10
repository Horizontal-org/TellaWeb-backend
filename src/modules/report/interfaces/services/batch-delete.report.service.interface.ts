export interface IBatchDeleteReportService {
  execute(toDelete: Array<string>): Promise<boolean>;
}
