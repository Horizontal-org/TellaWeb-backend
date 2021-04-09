import { Inject, Param, Post, UseGuards } from '@nestjs/common';

import { AuthController } from 'common/decorators/auth-controller.decorator';

import { ParamReport } from 'modules/report/decorators';
import { ReadReportDto } from 'modules/report/dto';
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
    @ParamReport('reportId') report: ReadReportDto,
    @Param('fileName') fileName: string,
  ) {
    await this.closeFileApplication.execute(
      {
        fileName,
        bucket: report.id,
      },
      report,
    );

    return;
  }
}
