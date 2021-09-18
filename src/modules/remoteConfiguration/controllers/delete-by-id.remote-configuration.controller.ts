import { Delete, Inject, Param } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { RolesUser } from 'modules/user/domain';

import {
  IDeleteByIdRemoteConfigurationApplication,
  TYPES,
} from '../interfaces';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { boolean } from 'yargs';

@AuthController('config', [RolesUser.ADMIN])
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
