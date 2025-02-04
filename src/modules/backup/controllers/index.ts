import { DeleteBackupController } from './delete.backup.controller';
import { DownloadBackupController } from './download.backup.controller';
import { LatestBackupController } from './latest.backup.controller';
import { StartBackupController } from './start.backup.controller';

export const backupControllers = [
    StartBackupController,
    LatestBackupController,
    DeleteBackupController,
    DownloadBackupController
];
