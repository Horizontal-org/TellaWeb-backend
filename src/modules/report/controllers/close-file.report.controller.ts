import { Inject, Param, Post, UseGuards } from '@nestjs/common';

import { AuthController } from 'common/decorators/auth-controller.decorator';

import {
  TYPES as TYPES_FILES,
  ICloseFileApplication,
} from 'modules/file/interfaces';
import { NotFoundReportException } from '../exceptions';
import { OnlyAuthor } from '../guard/only-author.report.guard';
import { IGetByIdReportApplication, TYPES } from '../interfaces';

@AuthController('reports')
export class CloseFileReportController {
  constructor(
    @Inject(TYPES.applications.IGetByIdReportApplication)
    private readonly getByIdReportApplication: IGetByIdReportApplication,
    @Inject(TYPES_FILES.applications.ICloseFileApplication)
    private readonly closeFileApplication: ICloseFileApplication,
  ) {}

  @UseGuards(OnlyAuthor)
  @Post(':reportId/:fileName')
  async handler(
    @Param('reportId') reportId: string,
    @Param('fileName') fileName: string,
  ) {
    const report = await this.getByIdReportApplication.execute(reportId);
    if (!report) throw new NotFoundReportException(reportId);

    await this.closeFileApplication.execute(
      {
        fileName,
        bucket: reportId,
      },
      report,
    );

    return;
  }
}
