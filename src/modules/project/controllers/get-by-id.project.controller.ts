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
    const project = await this.getByIdProjectApplication.execute(projectId);

    if (process.env.MASK_PUBLIC_DOMAIN && process.env.MASK_PUBLIC_DOMAIN.length > 0) {
      project.url = project.url.replace(process.env.PUBLIC_DOMAIN, process.env.MASK_PUBLIC_DOMAIN)
    }

    return project
  }
}
