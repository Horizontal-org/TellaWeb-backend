import { Get, Inject, Param } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { RolesUser } from 'modules/user/domain';

import { ReadReportDto } from '../dto';
import { TYPES, IGetByIdReportApplication } from '../interfaces';
import { AuthController } from 'common/decorators/auth-controller.decorator';

@AuthController('reports', [RolesUser.ADMIN])
export class GetByIdReportController {
  constructor(
    @Inject(TYPES.applications.IGetByIdReportApplication)
    private getByIdReportApplication: IGetByIdReportApplication,
  ) {}

  @ApiOkResponse({ type: ReadReportDto })
  @Get(':reportId')
  async findReportHandler(@Param('reportId') reportId: string) {
    return this.getByIdReportApplication.execute(reportId);
  }
}
