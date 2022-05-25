import { Inject, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';

import { RolesUser } from '../domain';
import { IDeleteByIdUserApplication, TYPES } from '../interfaces';
import { boolean } from 'yargs';

@AuthController('user', [RolesUser.ADMIN])
export class BatchDeleteUserController {
  constructor(
    // @Inject(TYPES.applications.IDeleteByIdUserApplication)
    // private readonly deleteByIdUserApplication: IDeleteByIdUserApplication,
  ) {}

  // @ApiOkResponse({ type: boolean })
  // @Post('batch-delete')
  // async handler(@Body() deleteDto: string) {
  //   return 
  // }
}
