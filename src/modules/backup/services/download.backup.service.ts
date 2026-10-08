import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BackupEntity } from '../domain';
import { IDownloadBackupService } from '../interfaces/services/download.backup.service.interface';
import { NotFoundBackupException } from '../exceptions/not-found.backup.exception';
import { promises as fsp } from 'fs';

@Injectable()
export class DownloadBackupService implements IDownloadBackupService {
  constructor(
    @InjectRepository(BackupEntity)
    private readonly backupRepo: Repository<BackupEntity>,
  ) {}

  async execute(backupId: string): Promise<string> {
    const backup = await this.backupRepo.findOne(backupId);

    // a 'processing' zip is still being written and 'error'/'deleted' ones
    // were removed from disk
    if (!backup || backup.status !== 'finished') {
      throw new NotFoundBackupException(backupId);
    }

    const zipPath = backup.folderName + '.zip';
    try {
      await fsp.access(zipPath);
    } catch (e) {
      throw new NotFoundBackupException(backupId);
    }

    return zipPath;
  }
}
