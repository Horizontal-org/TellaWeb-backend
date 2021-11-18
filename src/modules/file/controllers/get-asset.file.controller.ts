import { Get, Inject, Param, Res, Headers } from '@nestjs/common';
import { Response } from 'express';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { FileType } from '../domain';
import {
  TYPES,
  IGetAssetFileApplication,
  IGetByIdFileApplication,
  IStorageFileHandler,
} from '../interfaces';
import { createReadStream } from 'fs';
import { RolesUser } from 'modules/user/domain';

@AuthController('file', [RolesUser.ADMIN])
export class GetAssetFileController {
  constructor(
    @Inject(TYPES.applications.IGetAssetFileApplication)
    private readonly getAssetFileApplication: IGetAssetFileApplication,
    @Inject(TYPES.applications.IGetByIdFileApplication)
    private readonly getByIdFileApplication: IGetByIdFileApplication,
    @Inject(TYPES.handlers.IStorageFileHandler)
    private readonly storageFileHandler: IStorageFileHandler,
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
