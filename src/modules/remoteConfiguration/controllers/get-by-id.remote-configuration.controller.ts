import { Get, Inject, Param } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { RolesUser } from 'modules/user/domain';

import { ReadRemoteConfigurationDto } from '../dto';
import { TYPES, IGetByIdRemoteConfigurationApplication } from '../interfaces';
import { AuthController } from 'common/decorators/auth-controller.decorator';

@AuthController('config', [RolesUser.ADMIN])
export class GetByIdRemoteConfigurationController {
  constructor(
    @Inject(TYPES.applications.IGetByIdRemoteConfigurationApplication)
    private getByIdRemoteConfigurationApplication: IGetByIdRemoteConfigurationApplication,
  ) {}

  @ApiOkResponse({ type: ReadRemoteConfigurationDto })
  @Get(':configurationId')
  async handler(@Param('configurationId') configurationId: string) {
    return this.getByIdRemoteConfigurationApplication.execute(configurationId);
  }
}
