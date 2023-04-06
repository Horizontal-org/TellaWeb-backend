import { Body, Inject, Post } from '@nestjs/common';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { LoggedUser } from 'modules/auth/decorators';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { ReadUserDto } from 'modules/user/dto';
import { OtpCodeAuthDto } from '../dto/otp-code.auth.dto';
import { TYPES } from '../interfaces';
import { IActivateOtpAuthService } from '../interfaces/services/activate-otp.auth.service.interface';
import { ICreateRecoveryKeysService } from '../interfaces/services/create.recovery-keys.service.interface';
import { IVerifyOtpAuthService } from '../interfaces/services/verify-otp.auth.service.interface';


@AuthController('auth', [], JwtTypes.WEB)
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
