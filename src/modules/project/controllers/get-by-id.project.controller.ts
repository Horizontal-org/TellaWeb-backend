import { Get, Inject, Param } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { RolesUser } from 'modules/user/domain';

import { ReadProjectDto } from '../dto';
import { TYPES, IGetByIdProjectApplication } from '../interfaces';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

@AuthController('project', [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER], JwtTypes.ALL, 'id')
export class GetByIdProjectController {
  constructor(
    @Inject(TYPES.applications.IGetByIdProjectApplication)
    private getByIdProjectApplication: IGetByIdProjectApplication,
  ) {}

  @ApiOkResponse({ type: ReadProjectDto })
  @Get(':projectId')
  async handler(@Param('projectId') projectId: string) {
    return this.getByIdProjectApplication.execute(projectId);
  }
}
