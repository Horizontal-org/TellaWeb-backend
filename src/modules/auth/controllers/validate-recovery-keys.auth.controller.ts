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
import { IValidateRecoveryKeysService } from '../interfaces/services/validate.recovery-keys.service.interface';
import { LoginOtpAuthDto } from '../dto/login-otp.auth.dto';


@Controller('auth')
export class ValidateRecoveryKeysController {
  constructor(
    @Inject(TYPES.services.IValidateRecoveryKeysService)
    private validateRecoveryKeys: IValidateRecoveryKeysService,
  ) {}

  @Post('/otp/recovery-key')
  async handler(@Body() body: LoginOtpAuthDto): Promise<boolean> {
    await this.validateRecoveryKeys.execute(body.userId, body.code)

    return true
  }
}
