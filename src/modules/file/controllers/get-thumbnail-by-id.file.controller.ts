import { Controller, Get, Header, Inject, Param, Res } from '@nestjs/common';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { Response } from 'express';
import { RolesUser } from 'modules/user/domain';

import { TYPES, IGetThumbnailByIdFileApplication } from '../interfaces';

@AuthController('file', [RolesUser.ADMIN])
@Controller('file')
export class GetThumbnailByIdFileController {
  constructor(
    @Inject(TYPES.applications.IGetThumbnailByIdFileApplication)
    private readonly getThumbnailByIdFileApplication: IGetThumbnailByIdFileApplication,
  ) {}

  @Get('asset/:reportId/:fileId/:size')
  @Header('Content-Type', 'image/png')
  async handler(
    @Param('fileId')
    fileId: string,
    @Param('size') size: number,
    @Res() res: Response,
  ) {
    const fileStream = await this.getThumbnailByIdFileApplication.execute(
      fileId,
      { width: size | 200 },
    );
    fileStream.pipe(res);
  }
}
