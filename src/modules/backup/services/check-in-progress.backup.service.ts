import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BackupEntity } from '../domain';
import { ICheckInProgressBackupService } from '../interfaces/services/check-in-progress.backup.service.interface';

@Injectable()
export class CheckInProgressBackupService implements ICheckInProgressBackupService {
  constructor(
    @InjectRepository(BackupEntity)
    private readonly backupRepo: Repository<BackupEntity>,
  ) {}

  async execute(): Promise<boolean> {

    const backupsInProgress = await this.backupRepo
      .createQueryBuilder('backups')
      .where({ status: 'processing' })
      .getCount()
    
      console.log("🚀 ~ CheckInProgressBackupService ~ execute ~ backupsInProgress:", backupsInProgress)
      

    return !!backupsInProgress
  }
}
