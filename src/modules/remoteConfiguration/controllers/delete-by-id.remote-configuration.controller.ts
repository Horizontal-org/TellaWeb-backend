import { Delete, Inject, Param } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { RolesUser } from 'modules/user/domain';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { boolean } from 'yargs';
import {
  IDeleteByIdRemoteConfigurationApplication,
  TYPES
} from '../interfaces';

@AuthController('config', [RolesUser.ADMIN], JwtTypes.WEB)
export class DeleteByIdRemoteConfigurationController {
  constructor(
    @Inject(TYPES.applications.IDeleteByIdRemoteConfigurationApplication)
    private deleteByIdRemoteConfigurationApplication: IDeleteByIdRemoteConfigurationApplication,
  ) {}

  @ApiOkResponse({ type: boolean })
  @Delete(':configurationId')
  async handler(@Param('configurationId') configurationId: string) {
    return this.deleteByIdRemoteConfigurationApplication.execute(
      configurationId,
    );
  }
}
