import { Body, Inject, Post, ParseUUIDPipe, Param } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { RolesUser } from 'modules/user/domain';

import { TYPES, IStartBackupApplication } from '../interfaces';
import { ReadUserDto } from 'modules/user/dto';
import { LoggedUser } from 'modules/auth/decorators';

@AuthController('backup', [RolesUser.ADMIN], JwtTypes.WEB)
export class StartBackupController {
  constructor(
    @Inject(TYPES.applications.IStartBackupApplication)
    private startBackupApplication: IStartBackupApplication,
  ) {}

  @Post('')
  async handler(
    @LoggedUser() loggedUser: ReadUserDto
  ): Promise<void> {
    await this.startBackupApplication.execute(loggedUser);
  }
}
