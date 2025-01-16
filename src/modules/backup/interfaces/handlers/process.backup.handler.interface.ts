import { BackupEntity } from 'modules/backup/domain';

export interface IProcessBackupHandler {
  process(user: BackupEntity): Promise<void>;
}
