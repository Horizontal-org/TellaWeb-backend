import { Get, Inject, Param, Res } from '@nestjs/common';
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
  async handler(@Param('fileId') fileId: string, @Res() res: Response) {
    const fileStream = await this.getAssetFileApplication.execute(fileId);
    fileStream.pipe(res);
  }
}
