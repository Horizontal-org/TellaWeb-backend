import { LatestBackupDto } from "modules/backup/dto/latest.backup.dto";

export interface ILatestBackupService {
  execute(): Promise<LatestBackupDto>;
}
