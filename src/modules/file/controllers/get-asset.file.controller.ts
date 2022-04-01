import { Get, Headers, Inject, Param, Response } from '@nestjs/common';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { TYPES, IGetAssetFileApplication } from '../interfaces';
import { RolesUser } from 'modules/user/domain';

@AuthController('file', [RolesUser.ADMIN])
export class GetAssetFileController {
  constructor(
    @Inject(TYPES.applications.IGetAssetFileApplication)
    private readonly getAssetFileApplication: IGetAssetFileApplication,
  ) {}

  @Get('asset/:fileId')
  async handler(
    @Param('fileId') fileId: string,
    @Headers() headers,
    @Response() res,
  ) {
    const applicationResponse = await this.getAssetFileApplication.execute(
      fileId,
      headers.range,
    );

    res.set(applicationResponse.response);
    applicationResponse.stream.pipe(res);
  }
}
