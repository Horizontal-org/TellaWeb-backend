import { ForbiddenError } from '@casl/ability';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { LoggedUser } from 'modules/auth/decorators';
import { ReadUserDto } from 'modules/user/dto';
import { TYPES } from '../interfaces';
import { IGetRecoveryKeysService } from '../interfaces/services/get.recovery-keys.service.interface';


@AuthController('auth')
export class GetRecoveryKeysAuthController {
  constructor(
    @Inject(TYPES.services.IGetRecoveryKeysService)
    private getRecoveryKeysService: IGetRecoveryKeysService,
  ) {}

  @Get('/otp/recovery-key')
  async handler(@LoggedUser() loggedUser: ReadUserDto): Promise<string[]> {    
    const keys = await this.getRecoveryKeysService.execute(loggedUser.id)
    return keys
  }
}
