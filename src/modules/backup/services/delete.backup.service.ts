import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BackupEntity } from '../domain';
import { IDeleteBackupService, IProcessBackupHandler, TYPES } from '../interfaces';
import { rmSync } from 'fs';

@Injectable()
export class DeleteBackupService implements IDeleteBackupService {
  constructor(
    @InjectRepository(BackupEntity)
    private readonly backupRepo: Repository<BackupEntity>,    
  ) {}

  async execute(backupId: string): Promise<void> {
    console.log('DELETE', backupId)
    const backup = await this.backupRepo
      .createQueryBuilder('backups')      
      .where({ id: backupId })
      .getOne()
    
    if (!backup || backup.status === 'deleted') {
      throw new NotFoundException()
    }

    rmSync(backup.folderName + '.zip')
    
    backup.status = 'deleted'
    this.backupRepo.save(backup)
  }
}
