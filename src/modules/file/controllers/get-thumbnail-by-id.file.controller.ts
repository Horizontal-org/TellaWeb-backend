import { Get, Header, Inject, Param, Res } from '@nestjs/common';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { Response } from 'express';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { RolesUser } from 'modules/user/domain';

import { TYPES, IGetThumbnailByIdFileApplication } from '../interfaces';

@AuthController('file', [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER], JwtTypes.WEB)
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
    const thumbnailReadable = await this.getThumbnailByIdFileApplication.execute(
      fileId,
      { width: size | 200 },
    );
    thumbnailReadable.pipe(res);
  }
}
