import { Process, Processor } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Job } from 'bull';
import { IProcessBackupHandler, TYPES as TYPES_BACKUP } from 'modules/backup/interfaces';


@Processor('backups')
export class BackupsProcessor {

    constructor(
      @Inject(TYPES_BACKUP.handlers.IProcessBackupHandler)
      private backupHandler: IProcessBackupHandler,
    ) { }

    /** 
     * start backup
     * @param params
     * @returns 
     */
    @Process('start')
    async startBackup(job: Job) { 
        console.log('do something', job.data)
        await this.backupHandler.process(job.data)
    }
}