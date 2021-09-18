import { Post, Inject, Param, Body } from '@nestjs/common';
import { ApiOkResponse, ApiResponse } from '@nestjs/swagger';

import { RolesUser } from 'modules/user/domain';

import { ICreateRemoteConfigurationApplication, TYPES } from '../interfaces';
import { AuthController } from 'common/decorators/auth-controller.decorator';

import {
  CreateRemoteConfigurationDto,
  ReadRemoteConfigurationDto,
} from '../dto';

@AuthController('config', [RolesUser.ADMIN])
export class CreateRemoteConfigurationController {
  constructor(
    @Inject(TYPES.applications.ICreateRemoteConfigurationApplication)
    private createRemoteConfigurationApplication: ICreateRemoteConfigurationApplication,
  ) {}

  @ApiResponse({ type: ReadRemoteConfigurationDto })
  @Post()
  async handler(
    @Body() createRemoteConfigurationDto: CreateRemoteConfigurationDto,
  ) {
    return this.createRemoteConfigurationApplication.execute(
      createRemoteConfigurationDto,
    );
  }
}
