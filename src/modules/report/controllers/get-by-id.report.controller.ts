import { Get, Inject, Param } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { RolesUser } from 'modules/user/domain';

import { ReadReportDto } from '../dto';
import { TYPES, IGetByIdReportApplication } from '../interfaces';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

@AuthController('report', [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER], JwtTypes.WEB)
export class GetByIdReportController {
  constructor(
    @Inject(TYPES.applications.IGetByIdReportApplication)
    private getByIdReportApplication: IGetByIdReportApplication,
  ) {}

  @ApiOkResponse({ type: ReadReportDto })
  @Get(':reportId')
  async handler(@Param('reportId') reportId: string) {
    return this.getByIdReportApplication.execute(reportId);
  }
}
