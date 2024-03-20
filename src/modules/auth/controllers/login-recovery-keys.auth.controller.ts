import { ForbiddenError } from '@casl/ability';
import { Body, Controller, Get, Inject, Post, Res, UnauthorizedException } from '@nestjs/common';
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
  ICheckPasswordUserApplication,
  IGetByIdUserApplication,
  TYPES as TYPES_USER,
} from 'modules/user/interfaces';
import { LoginOtpAuthDto } from '../dto/login-otp.auth.dto';
import { LoginRecoveryKeysAuthDto } from '../dto/login-recovery-keys.auth.dto';
import { IValidateRecoveryKeysService } from '../interfaces/services/validate.recovery-keys.service.interface';


@Controller('auth')
export class LoginRecoveryKeysAuthController {
  constructor(
    @Inject(TYPES_USER.applications.IGetUserByIdApplication)
    private getByIdUserApplication: IGetByIdUserApplication,
    @Inject(TYPES.services.IGenerateTokenAuthService)
    private generateTokenAuthService: IGenerateTokenAuthService,
    @Inject(TYPES.services.IValidateRecoveryKeysService)
    private validateRecoveryKeysService: IValidateRecoveryKeysService,
    @Inject(TYPES_USER.applications.ICheckPasswordUserApplication)
    private checkPasswordApplication: ICheckPasswordUserApplication,    
  ) {}

  @Post('/otp/recovery-key')
  async handler(@Body() body: LoginRecoveryKeysAuthDto, @Res() response: Response): Promise<boolean> {
    const user = await this.getByIdUserApplication.execute(body.userId)
    
    // extra layer of security
    try {
      await this.checkPasswordApplication.execute({
        username: user.username,
        password: body.password
      })
    } catch (_) {
      throw new UnauthorizedException();
    }

    await this.validateRecoveryKeysService.execute(body.userId, body.code)

    const authToken = await this.generateTokenAuthService.execute({
      user: user,
      type: 'web',
      expiresIn: '1d'
    });
    
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
