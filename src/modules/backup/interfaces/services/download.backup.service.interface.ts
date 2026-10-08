export interface IDownloadBackupService {
    // returns the absolute path of the backup zip
    execute(backupId: string): Promise<string>;
}
