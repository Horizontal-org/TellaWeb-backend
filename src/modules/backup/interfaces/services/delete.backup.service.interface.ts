export interface IDeleteBackupService {
    execute(backupId: string): Promise<void>;
  }
  