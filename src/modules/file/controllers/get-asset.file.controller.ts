import { Get, Inject, Param, Res, Headers } from '@nestjs/common';
import { Response } from 'express';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { TYPES, IGetAssetFileApplication } from '../interfaces';
import { RolesUser } from 'modules/user/domain';

@AuthController('file', [RolesUser.ADMIN])
export class GetAssetFileController {
  constructor(
    @Inject(TYPES.applications.IGetAssetFileApplication)
    private readonly getAssetFileApplication: IGetAssetFileApplication,
  ) {}

  @Get('asset/:reportId/:fileId')
  async handler(
    @Param('fileId') fileId: string,
    @Res() res: Response,
    @Headers('range') range: string,
  ) {
    const applicationResponse = await this.getAssetFileApplication.execute(
      fileId,
      range,
    );

    res.set(applicationResponse.response);
    res.status(206);
    applicationResponse.stream
      .on('open', function () {
        applicationResponse.stream.pipe(res);
      })
      .on('error', function (err) {
        res.end(err);
      });
  }
}
