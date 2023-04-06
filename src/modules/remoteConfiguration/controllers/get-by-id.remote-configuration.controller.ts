import { Get, Inject, Param } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';


import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { ReadRemoteConfigurationDto } from '../dto';
import { IGetByIdRemoteConfigurationApplication, TYPES } from '../interfaces';

@AuthController('config', [], JwtTypes.ALL)
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
