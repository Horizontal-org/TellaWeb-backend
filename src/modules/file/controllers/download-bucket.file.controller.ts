import {
  Get,
  Inject,
  Param,
  ParseUUIDPipe,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { Response } from 'express';
import { basename, dirname } from 'path';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { RolesUser } from 'modules/user/domain';

import { TYPES, IGetZippedBucketFileApplication } from '../interfaces';
import { ReportAccessGuard } from 'modules/report/guard/access.report.guard';

@AuthController(
  'file',
  [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER],
  JwtTypes.ALL,
)
export class DownloadBucketFileController {
  constructor(
    @Inject(TYPES.applications.IGetZippedBucketFileApplication)
    private readonly getZippedBucketFileApplication: IGetZippedBucketFileApplication,
  ) {}

  @UseGuards(ReportAccessGuard)
  @Get('report/:reportId')
  async handler(
    @Param('reportId', ParseUUIDPipe)
    reportId: string,
    @Res() res: Response,
  ) {
    const zipStream =
      await this.getZippedBucketFileApplication.execute(reportId);

    res.attachment(`report-${reportId}.zip`);
    zipStream.on('error', (err) => {
      console.log('error zipping report => ', err);
      res.destroy(err);
    });
    zipStream.pipe(res);
  }

  @UseGuards(ReportAccessGuard)
  @Get('/download/:reportId/:fileId')
  async downloadFile(
    @Param('reportId', ParseUUIDPipe)
    bucketId: string,
    @Param('fileId')
    fileId: string,
    @Res() res: Response,
  ) {
    const filePath =
      await this.getZippedBucketFileApplication.getFilePathFromBucket(
        bucketId,
        fileId,
      );

    // res.download sets Content-Type/Content-Length/Content-Disposition and
    // supports Range requests (resumable downloads); see the backup download
    // for why the directory goes in `root`
    const options = { root: dirname(filePath) };
    res.download(basename(filePath), fileId, options, (err) => {
      if (!err) return;
      console.log('error downloading file => ', err);
      if (!res.headersSent) {
        res.status(500).end();
      }
    });
  }
}
