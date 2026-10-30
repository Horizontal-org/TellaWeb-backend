import {
  Get,
  Header,
  Inject,
  ParseArrayPipe,
  Query,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { Response } from 'express';
import { LoggedUser } from 'modules/auth/decorators';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { RolesUser } from 'modules/user/domain';
import { ReadUserDto } from 'modules/user/dto';

import { IDownloadResourceService, TYPES } from '../interfaces';
import { IUserHasResourceService } from '../interfaces/services/user-has.resource.service.interface';

@AuthController(
  'resource',
  [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER, RolesUser.REPORTER],
  JwtTypes.ALL,
)
export class DownloadResourceController {
  constructor(
    @Inject(TYPES.services.IDownloadResourceService)
    private readonly downloadService: IDownloadResourceService,
    @Inject(TYPES.services.IUserHasResourceService)
    private readonly userHasResourceService: IUserHasResourceService,
  ) {}

  @Get('download')
  @Header('Content-Type', 'application/zip')
  async handler(
    @Query('fileNames', new ParseArrayPipe()) fileNames = [],
    @LoggedUser() { id, role }: ReadUserDto,
    @Res() res: Response,
  ) {
    // same check as the asset routes; one name outside the user's projects refuses the whole zip
    if (role !== RolesUser.ADMIN) {
      for (const fileName of fileNames) {
        if (!(await this.userHasResourceService.execute(id, fileName))) {
          throw new UnauthorizedException();
        }
      }
    }

    const zipStream = await this.downloadService.execute(fileNames);
    zipStream.on('error', (err) => {
      console.log('error zipping resources => ', err);
      res.destroy(err);
    });
    zipStream.pipe(res);
  }
}
