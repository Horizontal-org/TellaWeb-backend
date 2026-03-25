import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BackupEntity } from '../domain';
import { IDownloadBackupService } from '../interfaces/services/download.backup.service.interface';
import { createReadStream, ReadStream } from 'fs';

@Injectable()
export class DownloadBackupService implements IDownloadBackupService {
  constructor(
    @InjectRepository(BackupEntity)
    private readonly backupRepo: Repository<BackupEntity>,
  ) {}

  async execute(backupId: string): Promise<ReadStream> {
    const backup = await this.backupRepo.findOne(backupId)
    return createReadStream(backup.folderName + '.zip');   
  }

}
