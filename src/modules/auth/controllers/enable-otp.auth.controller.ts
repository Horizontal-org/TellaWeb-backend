import { ForbiddenError } from '@casl/ability';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { LoggedUser } from 'modules/auth/decorators';
import { AbilityFactory, Actions } from 'casl/casl-ability.factory';
import { ReadUserDto } from 'modules/user/dto';
import { IEnableOtpAuthService, TYPES } from '../interfaces';
import { EnableOtpAuthDto } from '../dto/enable-otp.auth.dto';
import { EnableOtpResponseAuthDto } from '../dto/enable-otp-response.auth.dto';


@AuthController('auth')
export class EnableOtpAuthController {
  constructor(
    @Inject(TYPES.services.IEnableOtpAuthService)
    private enableOtpService: IEnableOtpAuthService,
  ) {}

  @Post('/otp/enable')
  async handler(@Body() body: EnableOtpAuthDto, @LoggedUser() loggedUser: ReadUserDto): Promise<EnableOtpResponseAuthDto> {
    
    const res = await this.enableOtpService.execute({ 
      username: loggedUser.username,
      password: body.password
    })

    return res;    
  }
}
