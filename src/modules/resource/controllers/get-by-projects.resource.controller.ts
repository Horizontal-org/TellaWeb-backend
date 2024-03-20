import { Get, Header, Inject, Param, ParseArrayPipe, Query, Res } from '@nestjs/common';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { Response } from 'express';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { RolesUser } from 'modules/user/domain';

import { IDownloadResourceService, IGetByProjectsResourceService, TYPES} from '../interfaces';
import { LoggedUser } from 'modules/auth/decorators';
import { ReadUserDto } from 'modules/user/dto';

@AuthController(
  'resource',
  [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER, RolesUser.REPORTER],
  JwtTypes.ALL,
)
export class GetByProjectsResourceController {
  constructor(
    @Inject(TYPES.services.IGetByProjectsResourceService)
    private readonly getResources: IGetByProjectsResourceService,
  ) {}

  @Get('projects')
  async handler(
    @Query('projectId', new ParseArrayPipe()) projectId = [],
    @LoggedUser() { id, username, role }: ReadUserDto,
  ) {

    const projects = await this.getResources.execute(projectId, id, role)
    return projects
  }

}
