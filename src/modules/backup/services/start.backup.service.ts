import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BackupEntity } from '../domain';
import { IStartBackupService } from '../interfaces';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { rmSync } from 'fs';
import { GlobalSettingEntity } from 'modules/globalSettings/domain';

@Injectable()
export class StartBackupService implements IStartBackupService {
  constructor(
    @InjectRepository(BackupEntity)
    private readonly backupRepo: Repository<BackupEntity>,
    @InjectRepository(GlobalSettingEntity)
    private readonly globalSettingRepo: Repository<GlobalSettingEntity>,
    @InjectQueue('backups')
    private backQueue: Queue
  ) {}

  async execute(user): Promise<void> {
    // delete previous backups
    const toDelete = await this.backupRepo
      .createQueryBuilder('backups')      
      .where({ status: 'finished' })
      .getMany()

    await toDelete.forEach(async(d) => {      
      try {
        rmSync(d.folderName + '.zip')
      } catch (e) {
        console.log("ERROR TRYING TO DELETE => ", e)
      }

      d.status = 'deleted'
      await this.backupRepo.save(d)
    })

    const backup = new BackupEntity();
    backup.user = user.id
    backup.status = 'processing'
    await this.backupRepo.save(backup)
    
    // TODO get emails enabled flag
    const gSetting = await this.globalSettingRepo.findOne({
      where: { name: 'SUSPICIOUS LOGIN DETECTION' }
    });
    console.log("🚀 ~ StartBackupService ~ execute ~ gSetting:", gSetting)

    this.backQueue.add('start', {
      backup: backup,
      receiver: user.username,
      emailEnabled: gSetting.enabled
    })
  }
}
