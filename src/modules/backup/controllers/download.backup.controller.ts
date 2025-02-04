import { Get, Header, Inject, Param, Res } from '@nestjs/common';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { Response } from 'express';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { RolesUser } from 'modules/user/domain';

import { IDownloadBackupService, TYPES } from '../interfaces';

@AuthController('backup', [RolesUser.ADMIN], JwtTypes.WEB)
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
    console.log('on downbload')
    const zipStream = await this.downloadBackupService.execute(
        backupId,
    );
    zipStream.pipe(res);
  }
}
