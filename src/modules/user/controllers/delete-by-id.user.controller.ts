import { Inject, Param, ParseUUIDPipe, Delete } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';

import { RolesUser } from '../domain';
import { IDeleteByIdUserApplication, TYPES } from '../interfaces';
import { boolean } from 'yargs';

@AuthController('user', [RolesUser.ADMIN])
export class DeleteByIdUserController {
  constructor(
    @Inject(TYPES.applications.IDeleteByIdUserApplication)
    private readonly deleteByIdUserApplication: IDeleteByIdUserApplication,
  ) {}

  @ApiOkResponse({ type: boolean })
  @Delete(':userId')
  async handler(@Param('userId', new ParseUUIDPipe()) userId: string) {
    return this.deleteByIdUserApplication.execute(userId);
  }
}
