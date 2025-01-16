import { ReadStream } from "fs";

export interface IDownloadBackupService {
    execute(backupId: string): Promise<ReadStream>;
}
  