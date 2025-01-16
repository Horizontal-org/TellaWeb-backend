import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BackupEntity } from '../domain';
import { ICheckInProgressBackupService } from '../interfaces/services/check-in-progress.backup.service.interface';
import { LatestBackupDto } from '../dto/latest.backup.dto';
import { ILatestBackupService } from '../interfaces/services/latest.backup.service.interface';

@Injectable()
export class LatestBackupService implements ILatestBackupService {
  constructor(
    @InjectRepository(BackupEntity)
    private readonly backupRepo: Repository<BackupEntity>,
  ) {}

  async execute(): Promise<LatestBackupDto> {

    const latest = {
        deleted: await this.getLatest('deleted'),
        latest: await this.getLatest('finished'),
        processing: await this.getLatest('processing')
    }
            
    return latest
  }

  private async getLatest (status: string): Promise<BackupEntity> {
    return await this.backupRepo
        .createQueryBuilder('backups')
        .where({ status: status })
        .orderBy('created_at', 'DESC')
        .getOne()
  }
}
