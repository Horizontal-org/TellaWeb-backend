import { Get, Inject, Param, Res } from '@nestjs/common';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { Response } from 'express';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { RolesUser } from 'modules/user/domain';

import { IDownloadBackupService, TYPES } from '../interfaces';

@AuthController('backup', [RolesUser.ADMIN], JwtTypes.ALL)
export class DownloadBackupController {
  constructor(
    @Inject(TYPES.services.IDownloadBackupService)
    private readonly downloadBackupService: IDownloadBackupService,
  ) {}

  @Get('download/:backupId')
  async handler(
    @Param('backupId')
    backupId: string,
    @Res() res: Response,
  ) {
    const zipPath = await this.downloadBackupService.execute(backupId);

    // res.download sets Content-Type/Content-Length/Content-Disposition,
    // supports Range requests (resumable downloads) and reports read errors
    // to the callback instead of crashing the process
    res.download(zipPath, 'TELLAWEB_BACKUP.zip', (err) => {
      if (!err) return;
      console.log('error downloading backup => ', err);
      if (!res.headersSent) {
        res.status(500).end();
      }
    });
  }
}
