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
  // @HttpCode(206)
  async handler(
    @Param('fileId') fileId: string,
    @Res() res: Response,
    @Headers('range') range: string,
  ) {
    const file = await this.getByIdFileApplication.execute(fileId);
    const fileSize = await this.storageFileHandler.fileSize(file, false);
    const filePath = this.storageFileHandler.getPath(file, false);

    if (file.type === FileType.IMAGE) {
      const fileImageStream = await this.getAssetFileApplication.execute(
        fileId,
      );
      fileImageStream.pipe(res);
      return;
    }

    const rangeArray = range.replace('bytes=', '').split('-');
    const start = parseInt(rangeArray[0], 10);
    const end = rangeArray[1] ? parseInt(rangeArray[1], 10) : fileSize - 1;
    const chunk = 1024 * 1000;
    res.set({
      'Content-Length': chunk,
      'Content-Range': 'bytes ' + start + '-' + end + '/' + fileSize,
      'Accept-Ranges': 'bytes',
    });

    res.status(206);

    const fileStream = createReadStream(filePath, { start: start, end: end })
      .on('open', function () {
        fileStream.pipe(res);
      })
      .on('error', function (err) {
        res.end(err);
      });
    // fileStream.pipe(res);
  }
}
