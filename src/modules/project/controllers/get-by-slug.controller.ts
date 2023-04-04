import { Get, Inject, Param } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { RolesUser } from 'modules/user/domain';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { ReadProjectDto } from '../dto';
import { IGetBySlugProjectApplication, TYPES } from '../interfaces';

@AuthController('p', [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER, RolesUser.REPORTER], JwtTypes.ALL, 'slug')
export class GetBySlugProjectController {
  constructor(
    @Inject(TYPES.applications.IGetBySlugProjectApplication)
    private getBySlugProjectApplication: IGetBySlugProjectApplication,
  ) {}

  @ApiOkResponse({ type: ReadProjectDto })
  @Get(':projectSlug')
  async handler(@Param('projectSlug') projectSlug: string) {
    return this.getBySlugProjectApplication.execute(projectSlug);
  }
}
