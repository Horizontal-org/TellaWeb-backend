import { Body, Inject, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { RolesUser } from 'modules/user/domain';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { LoggedUser } from 'modules/auth/decorators';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { ReadUserDto } from 'modules/user/dto';
import { BatchDeleteReportDto } from '../dto/batch-delete.report.dto';
import { IBatchDeleteReportApplication, TYPES } from '../interfaces';

@AuthController('report', [RolesUser.ADMIN, RolesUser.EDITOR], JwtTypes.WEB)
export class BatchDeleteReportController {
  constructor(
    @Inject(TYPES.applications.IBatchDeleteReportApplication)
    private batchDeleteReportApplication: IBatchDeleteReportApplication,
  ) {}

  @ApiOkResponse({ type: Boolean })
  @Post('batch-delete')
  async handler(
    @Body() deleteDto: BatchDeleteReportDto,
    @LoggedUser() user: ReadUserDto,
  ) {
    return this.batchDeleteReportApplication.execute(deleteDto.toDelete, user);
  }
}
