import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ReadUserDto } from 'modules/user/dto';
import {
  TYPES,
  IStartBackupApplication,
  ICheckInProgressBackupService,
  IStartBackupService,
} from '../interfaces';
import { BackupAlreadyInProgressException } from '../exceptions/already-in-progress.exception';

@Injectable()
export class StartBackupApplication implements IStartBackupApplication {
  constructor(
    @Inject(TYPES.services.ICheckInProgressBackupService)
    private readonly checkInProgressService: ICheckInProgressBackupService,
    @Inject(TYPES.services.IStartBackupService)
    private readonly startBackupService: IStartBackupService,
  ) {}

  async execute(user): Promise<void> {
    const backupsInProgress = await this.checkInProgressService.execute()

    // COMMENT FOR QUICK TESTING
    // if (backupsInProgress) {
    //     throw new BackupAlreadyInProgressException()
    // }

    await this.startBackupService.execute(user)
  }
}
