import { Get, Header, Inject, Param, ParseArrayPipe, Query, Res } from '@nestjs/common';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { Response } from 'express';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { RolesUser } from 'modules/user/domain';

import { IDownloadResourceService, TYPES} from '../interfaces';

@AuthController(
  'resource',
  [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER, RolesUser.REPORTER],
  JwtTypes.ALL,
)
export class DownloadResourceController {
  constructor(
    @Inject(TYPES.services.IDownloadResourceService)
    private readonly downloadService: IDownloadResourceService,
  ) {}

  @Get('download')
  @Header('Content-Type', 'application/zip')
  async handler(
    @Query('fileNames', new ParseArrayPipe()) fileNames = [],    
    @Res() res: Response,
  ) {
    console.log("🚀 ~ file: download.resource.controller.ts:26 ~ DownloadResourceController ~ fileNames:", fileNames)
    const zipStream = await this.downloadService.execute(fileNames);
    zipStream.pipe(res);
  }

}
