import { BackupEntity } from 'modules/backup/domain';
import { ProcessBackupDto } from 'modules/backup/dto/process.backup.dto';

export interface IProcessBackupHandler {
  process(processData: ProcessBackupDto): Promise<void>;
}
