import { Controller, Get, Inject, Param, UseGuards } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { RolesUser } from 'modules/user/domain';

import { ReadProjectDto } from '../dto';
import { TYPES, IGetByIdProjectApplication, IGetBySlugProjectApplication } from '../interfaces';
import { AuthController } from 'common/decorators/auth-controller.decorator';

@AuthController('p', [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER, RolesUser.REPORTER], 'slug')
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
