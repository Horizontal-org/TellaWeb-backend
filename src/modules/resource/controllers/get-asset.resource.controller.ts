import {
  Get,
  Headers,
  HttpCode,
  Inject,
  Param,
  Response,
} from '@nestjs/common';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { TYPES } from '../interfaces';
import { RolesUser } from 'modules/user/domain';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { IStorageFileHandler } from 'modules/file/interfaces';
import { ReadUserDto } from 'modules/user/dto';
import { LoggedUser } from 'modules/auth/decorators';

// JWT IS ALL BECAUSE THIS IS BEING CONSUMED AS A COOKIE
@AuthController('resource', [RolesUser.ADMIN, RolesUser.EDITOR], JwtTypes.ALL)
export class GetAssetResourceController {
  constructor(
    @Inject(TYPES.handlers.IStorageFileHandler)
    private readonly storageFileHandler: IStorageFileHandler,
  ) {}

  @Get('asset/:fileName')
  @HttpCode(206)
  async handler(
    @Param('fileName') fileName: string,
    @LoggedUser() { id, username, role }: ReadUserDto,
    @Headers() headers,
    @Response() res,
  ) {
    console.log('HERE')
    const stream = await this.storageFileHandler.fetch({
      bucket: 'resources',
      fileName: fileName
    });

    stream.pipe(res)
  }
}
