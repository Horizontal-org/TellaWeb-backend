import { BackupEntity } from "../domain";

export class ProcessBackupDto {
    receiver: string;

    backup: BackupEntity;

    emailEnabled: boolean;    
}