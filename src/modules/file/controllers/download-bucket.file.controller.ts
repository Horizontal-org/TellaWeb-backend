import { Get, Header, Inject, Param, Res } from '@nestjs/common';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { Response } from 'express';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { RolesUser } from 'modules/user/domain';

import { TYPES, IGetZippedBucketFileApplication } from '../interfaces';

@AuthController('file', [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER], JwtTypes.ALL)
export class DownloadBucketFileController {
  constructor(
    @Inject(TYPES.applications.IGetZippedBucketFileApplication)
    private readonly getZippedBucketFileApplication: IGetZippedBucketFileApplication,
  ) {}

  @Get('report/:reportId')
  @Header('Content-Type', 'application/zip')
  async handler(
    @Param('reportId')
    reportId: string,
    @Res() res: Response,
  ) {
    const zipStream = await this.getZippedBucketFileApplication.execute(
      reportId,
    );
    zipStream.pipe(res);
  }
}
