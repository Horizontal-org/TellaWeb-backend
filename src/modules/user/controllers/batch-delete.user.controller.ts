import { Body, Inject, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';

import { RolesUser } from '../domain';
import { TYPES } from '../interfaces';
import { boolean } from 'yargs';
import { IBatchDeleteUsersApplication } from '../interfaces/applications/batch-delete.user.application.interface';
import { BatchDeleteUsersDto } from '../dto';

@AuthController('user', [RolesUser.ADMIN])
export class BatchDeleteUsersController {
  constructor(
    @Inject(TYPES.applications.IBatchDeleteUsersApplication)
    private readonly batchDeleteUsersApplication: IBatchDeleteUsersApplication,
  ) {}

  @ApiOkResponse({ type: boolean })
  @Post('batch-delete')
  async handler(@Body() deleteDto: BatchDeleteUsersDto) {
    return this.batchDeleteUsersApplication.execute(deleteDto.toDelete);
  }
}
