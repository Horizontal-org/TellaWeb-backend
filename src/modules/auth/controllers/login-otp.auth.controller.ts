import { ForbiddenError } from '@casl/ability';
import { Body, Controller, Get, Inject, Post, Res } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { LoggedUser } from 'modules/auth/decorators';
import { AbilityFactory, Actions } from 'casl/casl-ability.factory';
import { ReadUserDto } from 'modules/user/dto';
import { IEnableOtpAuthService, IGenerateTokenAuthService, IOtpAuthHandler, TYPES } from '../interfaces';

import { OtpCodeAuthDto } from '../dto/otp-code.auth.dto';
import { IVerifyOtpAuthService } from '../interfaces/services/verify-otp.auth.service.interface';
import {
  IGetByIdUserApplication,
  TYPES as TYPES_USER,
} from 'modules/user/interfaces';
import { LoginOtpAuthDto } from '../dto/login-otp.auth.dto';


@Controller('auth')
export class LoginOtpAuthController {
  constructor(
    @Inject(TYPES_USER.applications.IGetUserByIdApplication)
    private getByIdUserApplication: IGetByIdUserApplication,
    @Inject(TYPES.services.IGenerateTokenAuthService)
    private generateTokenAuthService: IGenerateTokenAuthService,
    @Inject(TYPES.services.IVerifyOtpAuthService)
    private verifyOtpService: IVerifyOtpAuthService,
  ) {}

  @Post('/otp/login')
  async handler(@Body() body: LoginOtpAuthDto, @Res() response: Response): Promise<boolean> {
    await this.verifyOtpService.execute(body.code, body.userId)
    const user = await this.getByIdUserApplication.execute(body.userId)
    const authToken = await this.generateTokenAuthService.execute(user);

    response
      .cookie('access_token', authToken.access_token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
        domain: process.env.COOKIE_DOMAIN,
      })
      .send({
        ...authToken,
        user,
      });
        
    return true
  }
}
