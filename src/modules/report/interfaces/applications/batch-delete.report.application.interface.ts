export interface IBatchDeleteReportApplication {
  execute(toDelete: Array<string>): Promise<boolean>;
}
