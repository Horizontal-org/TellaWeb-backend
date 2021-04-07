import { Inject, Param, Post } from '@nestjs/common';

import { AuthController } from 'common/decorators/auth-controller.decorator';

//import { UserEntity } from 'modules/user/domain';
//import { LoggedUser } from 'modules/auth/decorators';
import {
  TYPES as TYPES_FILES,
  ICloseFileApplication,
} from 'modules/files/interfaces';

import { ReportNotFound } from '../exceptions';
import { TYPES, IGetByIdReportApplication } from '../interfaces';

@AuthController('reports')
export class CloseFileReportController {
  constructor(
    @Inject(TYPES.applications.IGetByIdReportApplication)
    private getByIdReportApplication: IGetByIdReportApplication,
    @Inject(TYPES_FILES.applications.ICloseFileApplication)
    private readonly closeFileApplication: ICloseFileApplication,
  ) {}

  @Post(':reportId/:fileName')
  async handler(
    @Param('reportId') reportId: string,
    @Param('fileName') fileName: string,
  ) {
    const report = await this.getByIdReportApplication.execute(reportId);
    if (!report) throw new ReportNotFound(reportId);

    await this.closeFileApplication.execute({
      fileName,
      bucket: reportId,
    });

    // todo add file to report

    return;
  }
}
