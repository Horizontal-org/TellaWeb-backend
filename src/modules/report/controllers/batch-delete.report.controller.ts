import { Delete, Inject, Param, Post, Body } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { RolesUser } from 'modules/user/domain';

import { TYPES, IBatchDeleteReportApplication } from '../interfaces';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { boolean } from 'yargs';
import { BatchDeleteReportDto } from '../dto/batch-delete.report.dto';

@AuthController('report', [RolesUser.ADMIN])
export class BatchDeleteReportController {
  constructor(
    @Inject(TYPES.applications.IBatchDeleteReportApplication)
    private batchDeleteReportApplication: IBatchDeleteReportApplication,
  ) {}

  @ApiOkResponse({ type: boolean })
  @Post('batch-delete')
  async handler(@Body() deleteDto: BatchDeleteReportDto) {
    return this.batchDeleteReportApplication.execute(deleteDto.toDelete);
  }
}
