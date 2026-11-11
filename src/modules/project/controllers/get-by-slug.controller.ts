import { Get, Inject, Param } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { RolesUser } from 'modules/user/domain';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { LoggedUser } from 'modules/auth/decorators';
import { ReadUserDto } from 'modules/user/dto';
import { ReadProjectDto } from '../dto';
import { IGetBySlugProjectApplication, TYPES } from '../interfaces';

@AuthController(
  'p',
  [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER, RolesUser.REPORTER],
  JwtTypes.ALL,
  'slug',
)
export class GetBySlugProjectController {
  constructor(
    @Inject(TYPES.applications.IGetBySlugProjectApplication)
    private getBySlugProjectApplication: IGetBySlugProjectApplication,
  ) {}

  @ApiOkResponse({ type: ReadProjectDto })
  @Get(':projectSlug')
  async handler(
    @Param('projectSlug') projectSlug: string,
    @LoggedUser() user: ReadUserDto,
  ) {
    const project = await this.getBySlugProjectApplication.execute(projectSlug);
    // reporters (mobile) don't need the member list, and it exposes user ids
    if (user.role === RolesUser.REPORTER) delete project.users;
    return project;
  }
}
