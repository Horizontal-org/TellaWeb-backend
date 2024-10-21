import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BackupEntity } from '../domain';
import { IStartBackupService } from '../interfaces';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { ReadUserDto } from 'modules/user/dto';

@Injectable()
export class StartBackupService implements IStartBackupService {
  constructor(
    @InjectRepository(BackupEntity)
    private readonly backupRepo: Repository<BackupEntity>,
    @InjectQueue('backups')
    private backQueue: Queue
  ) {}

  async execute(user): Promise<void> {
    console.log("🚀 ~ StartBackupService ~ execute ~ userId:", user.id)

    const backup = new BackupEntity();
    backup.user = user.id
    backup.status = 'processing'
    await this.backupRepo.save(backup)
    
    this.backQueue.add('start', user)    
  }
}
