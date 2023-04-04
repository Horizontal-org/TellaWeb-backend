import { Body, Inject, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { RolesUser } from 'modules/user/domain';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { ICreateRemoteConfigurationApplication, TYPES } from '../interfaces';

import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import {
  CreateRemoteConfigurationDto,
  ReadRemoteConfigurationDto
} from '../dto';

@AuthController('config', [RolesUser.ADMIN], JwtTypes.WEB)
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
