import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BackupEntity } from '../domain';
import { ICheckInProgressBackupService } from '../interfaces/services/check-in-progress.backup.service.interface';

const STALE_BACKUP_MS = 12 * 60 * 60 * 1000;

@Injectable()
export class CheckInProgressBackupService implements ICheckInProgressBackupService {
  constructor(
    @InjectRepository(BackupEntity)
    private readonly backupRepo: Repository<BackupEntity>,
  ) {}

  async execute(): Promise<boolean> {
    // a backup killed mid-way (OOM, container restart, deploy) never reaches
    // its catch, so treat very old 'processing' rows as dead instead of
    // letting them block new backups forever
    await this.backupRepo
      .createQueryBuilder()
      .update()
      .set({ status: 'error' })
      .where('status = :status', { status: 'processing' })
      .andWhere('created_at < :limit', {
        limit: new Date(Date.now() - STALE_BACKUP_MS),
      })
      .execute();

    const backupsInProgress = await this.backupRepo
      .createQueryBuilder('backups')
      .where({ status: 'processing' })
      .getCount()
    
      console.log("🚀 ~ CheckInProgressBackupService ~ execute ~ backupsInProgress:", backupsInProgress)
      

    return !!backupsInProgress
  }
}
