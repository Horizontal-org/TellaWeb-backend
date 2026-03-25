import { Controller, Get, Header, Inject, Param, Res } from '@nestjs/common';
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
  @Header('Content-Type', 'application/zip')
  async handler(
    @Param('backupId')
    backupId: string,
    @Res() res: Response,
  ) {
    const zipStream = await this.downloadBackupService.execute(
        backupId,
    );
    res.header('Content-disposition', 'attachment; filename=TELLAWEB_BACKUP.zip');
    zipStream.pipe(res);
  }
}
