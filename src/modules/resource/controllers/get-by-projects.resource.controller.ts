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
    console.log("🚀 ~ file: get-by-projects.resource.controller.ts:27 ~ GetByProjectsResourceController ~ role:", role)
    console.log("🚀 ~ file: download.resource.controller.ts:26 ~ DownloadResourceController ~ fileNames:", id)

    await this.getResources.execute(projectId, id, role)

    // get resources where project id and user is in
    // const zipStream = await this.downloadService.execute(fileNames);
    // zipStream.pipe(res);
  }

}
