import { Inject, Param, Post, UseGuards } from '@nestjs/common';

import { AuthController } from 'common/decorators/auth-controller.decorator';

import { OnlyAuthor } from 'modules/report/guard/only-author.report.guard';

import { TYPES, ICloseFileApplication } from '../interfaces';

@AuthController('file')
export class CloseFileReportController {
  constructor(
    @Inject(TYPES.applications.ICloseFileApplication)
    private readonly closeFileApplication: ICloseFileApplication,
  ) {}

  @UseGuards(OnlyAuthor)
  @Post(':reportId/:fileName')
  async handler(
    @Param('reportId') reportId: string,
    @Param('fileName') fileName: string,
  ) {
    await this.closeFileApplication.execute(
      {
        fileName,
        bucket: reportId,
      },
      reportId,
    );

    return;
  }
}
