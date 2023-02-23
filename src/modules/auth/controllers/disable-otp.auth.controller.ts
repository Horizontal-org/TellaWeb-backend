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
import { IDisableOtpAuthService } from '../interfaces/services/disable-otp.auth.service.interface';
import { DisableOtpAuthDto } from '../dto/disable-otp.auth.dto';
import { IValidateRecoveryKeysService } from '../interfaces/services/validate.recovery-keys.service.interface';


@AuthController('auth')
export class DisableOtpAuthController {
  constructor(
    @Inject(TYPES.services.IVerifyOtpAuthService)
    private verifyOtpService: IVerifyOtpAuthService,
    @Inject(TYPES.services.IDisableOtpAuthService)
    private disableOtpService: IDisableOtpAuthService,
    @Inject(TYPES.services.IValidateRecoveryKeysService)
    private validateRecoveryKeysService: IValidateRecoveryKeysService,
  ) {}

  @Post('/otp/disable')
  async handler(@Body() body: DisableOtpAuthDto, @LoggedUser() loggedUser: ReadUserDto): Promise<boolean> {
    if (body.is_otp) {
      await this.verifyOtpService.execute(body.code, loggedUser.id)
    } else {
      await this.validateRecoveryKeysService.execute(loggedUser.id, body.code)
    }

    await this.disableOtpService.execute(loggedUser.id)
    
    return true
  }
}
