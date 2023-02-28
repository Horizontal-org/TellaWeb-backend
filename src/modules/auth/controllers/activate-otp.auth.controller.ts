import { ForbiddenError } from '@casl/ability';
import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { LoggedUser } from 'modules/auth/decorators';
import { AbilityFactory, Actions } from 'casl/casl-ability.factory';
import { ReadUserDto } from 'modules/user/dto';
import { IEnableOtpAuthService, IOtpAuthHandler, TYPES } from '../interfaces';
import { EnableOtpAuthDto } from '../dto/enable-otp.auth.dto';
import { EnableOtpResponseAuthDto } from '../dto/enable-otp-response.auth.dto';
import { OtpCodeAuthDto } from '../dto/otp-code.auth.dto';
import { IVerifyOtpAuthService } from '../interfaces/services/verify-otp.auth.service.interface';
import { IActivateOtpAuthService } from '../interfaces/services/activate-otp.auth.service.interface';
import { ICreateRecoveryKeysService } from '../interfaces/services/create.recovery-keys.service.interface';


@AuthController('auth')
export class ActivateOtpAuthController {
  constructor(
    @Inject(TYPES.services.IVerifyOtpAuthService)
    private verifyOtpService: IVerifyOtpAuthService,
    @Inject(TYPES.services.IActivateOtpAuthService)
    private activateOtpService: IActivateOtpAuthService,
    @Inject(TYPES.services.ICreateRecoveryKeysService)
    private createRecoveryKeysService: ICreateRecoveryKeysService,
  ) {}

  @Post('/otp/activate')
  async handler(@Body() body: OtpCodeAuthDto, @LoggedUser() loggedUser: ReadUserDto): Promise<string[]> {
    await this.verifyOtpService.execute(body.code, loggedUser.id)
    await this.activateOtpService.execute(loggedUser.id)
    const keys = await this.createRecoveryKeysService.execute(loggedUser.id)
    return keys
  }
}