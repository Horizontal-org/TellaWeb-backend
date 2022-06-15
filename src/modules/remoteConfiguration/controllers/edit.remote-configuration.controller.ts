import { Body, Inject, Post, ParseUUIDPipe, Param } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { RolesUser } from 'modules/user/domain';

import { EditRemoteConfigurationDto, ReadRemoteConfigurationDto } from '../dto';
import { TYPES, IEditRemoteConfigurationApplication } from '../interfaces';

@AuthController('config', [RolesUser.ADMIN])
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
