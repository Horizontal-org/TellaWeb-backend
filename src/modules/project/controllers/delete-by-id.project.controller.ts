import { Delete, Inject, Param } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { RolesUser } from 'modules/user/domain';

import { TYPES, IDeleteByIdProjectApplication } from '../interfaces';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { boolean } from 'yargs';

@AuthController('project', [RolesUser.ADMIN, RolesUser.EDITOR])
export class DeleteByIdProjectController {
  constructor(
    @Inject(TYPES.applications.IDeleteByIdProjectApplication)
    private deleteByIdProjectApplication: IDeleteByIdProjectApplication,
  ) {}

  @ApiOkResponse({ type: boolean })
  @Delete(':projectId')
  async handler(@Param('projectId') projectId: string) {
    return this.deleteByIdProjectApplication.execute(projectId);
  }
}
