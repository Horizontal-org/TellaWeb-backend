import { Controller, Get, Header, Inject, Param, Res } from '@nestjs/common';
import { Response } from 'express';

import { TYPES, IGetZippedBucketFileApplication } from '../interfaces';

@Controller('file')
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
