import { Body, Inject, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { RolesUser } from 'modules/user/domain';

import { EditRemoteConfigurationDto, ReadRemoteConfigurationDto } from '../dto';
import { IEditRemoteConfigurationApplication, TYPES } from '../interfaces';

@AuthController('config', [RolesUser.ADMIN], JwtTypes.WEB)
export class EditRemoteConfigurationController {
  constructor(
    @Inject(TYPES.applications.IEditRemoteConfigurationApplication)
    private editRemoteConfigurationApplication: IEditRemoteConfigurationApplication,
  ) {}

  @ApiResponse({ type: ReadRemoteConfigurationDto })
  @Post(':configurationId')
  async handler(
    @Body() editRemoteConfigurationDto: EditRemoteConfigurationDto,
    @Param('configurationId', new ParseUUIDPipe()) configurationId: string,
  ): Promise<ReadRemoteConfigurationDto> {
    editRemoteConfigurationDto.id = configurationId;
    const remoteConfiguration = await this.editRemoteConfigurationApplication.execute(editRemoteConfigurationDto);

    return remoteConfiguration;
  }
}
