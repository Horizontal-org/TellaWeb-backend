import { Body, Inject, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';

import { RolesUser } from '../domain';
import { TYPES } from '../interfaces';
import { boolean } from 'yargs';
import { IBatchDeleteUsersApplication } from '../interfaces/applications/batch-delete.user.application.interface';
import { BatchDeleteUsersDto } from '../dto';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

@AuthController('user', [RolesUser.ADMIN], JwtTypes.WEB)
export class BatchDeleteUsersController {
  constructor(
    @Inject(TYPES.applications.IBatchDeleteUsersApplication)
    private batchDeleteUsersApplication: IBatchDeleteUsersApplication,
  ) {}

  @ApiOkResponse({ type: boolean })
  @Post('batch-delete')
  async handler(@Body() deleteDto: BatchDeleteUsersDto) {
    return this.batchDeleteUsersApplication.execute(deleteDto.toDelete);
  }
}
