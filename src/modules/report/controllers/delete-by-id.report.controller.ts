import { Delete, Inject, Param, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { RolesUser } from 'modules/user/domain';

import { TYPES, IDeleteByIdReportApplication } from '../interfaces';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { ReportAccessGuard } from '../guard/access.report.guard';

@AuthController('report', [RolesUser.ADMIN, RolesUser.EDITOR], JwtTypes.WEB)
export class DeleteByIdReportController {
  constructor(
    @Inject(TYPES.applications.IDeleteByIdReportApplication)
    private deleteByIdReportApplication: IDeleteByIdReportApplication,
  ) {}

  @ApiOkResponse({ type: Boolean })
  @UseGuards(ReportAccessGuard)
  @Delete(':reportId')
  async handler(@Param('reportId') reportId: string) {
    return this.deleteByIdReportApplication.execute(reportId);
  }
}
