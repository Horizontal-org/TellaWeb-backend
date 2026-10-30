import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { ReadUserDto } from 'modules/user/dto';
import {
  TYPES,
  IStartBackupApplication,
  ICheckInProgressBackupService,
  ICheckSpaceBackupService,
  IStartBackupService,
} from '../interfaces';
import { BackupAlreadyInProgressException } from '../exceptions/already-in-progress.exception';
import { NotEnoughSpaceBackupException } from '../exceptions/not-enough-space.backup.exception';

@Injectable()
export class StartBackupApplication implements IStartBackupApplication {
  constructor(
    @Inject(TYPES.services.ICheckInProgressBackupService)
    private readonly checkInProgressService: ICheckInProgressBackupService,
    @Inject(TYPES.services.ICheckSpaceBackupService)
    private readonly checkSpaceService: ICheckSpaceBackupService,
    @Inject(TYPES.services.IStartBackupService)
    private readonly startBackupService: IStartBackupService,
  ) {}

  async execute(user): Promise<void> {
    const backupsInProgress = await this.checkInProgressService.execute();

    // COMMENT FOR QUICK TESTING
    if (backupsInProgress) {
      throw new BackupAlreadyInProgressException();
    }

    // before startBackupService, which deletes the previous backup
    const { needed, available } = await this.checkSpaceService.execute();
    if (available < needed) {
      throw new NotEnoughSpaceBackupException(needed, available);
    }

    await this.startBackupService.execute(user);
  }
}
