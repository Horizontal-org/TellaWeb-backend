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
    // a class instance, not a plain object: TransformInterceptor only serializes
    // class instances, and that is what applies @Exclude on the entities
    const latest = Object.assign(new LatestBackupDto(), {
      deleted: await this.getLatest('deleted'),
      latest: await this.getLatest('finished'),
      processing: await this.getLatest('processing'),
    });

    return latest;
  }

  private async getLatest(status: string): Promise<BackupEntity> {
    const backup = await this.backupRepo
      .createQueryBuilder('backups')
      .where({ status: status })
      .orderBy('created_at', 'DESC')
      .getOne();
    // TypeORM 0.3 returns null where 0.2 returned undefined; keep the field
    // out of the response as before
    return backup ?? undefined;
  }
}
