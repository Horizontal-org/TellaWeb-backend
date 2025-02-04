export interface ICheckInProgressBackupService {
  execute(): Promise<boolean>;
}
