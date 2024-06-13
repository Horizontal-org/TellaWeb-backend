import { Body, Inject, Post } from '@nestjs/common';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { LoggedUser } from 'modules/auth/decorators';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { ReadUserDto } from 'modules/user/dto';
import { DisableOtpAuthDto } from '../dto/disable-otp.auth.dto';
import { TYPES } from '../interfaces';
import { ICheckPasswordUserApplication, TYPES as USER_TYPES } from '../../user/interfaces';
import { IDisableOtpAuthService } from '../interfaces/services/disable-otp.auth.service.interface';
import { IValidateRecoveryKeysService } from '../interfaces/services/validate.recovery-keys.service.interface';
import { IVerifyOtpAuthService } from '../interfaces/services/verify-otp.auth.service.interface';


@AuthController('auth', [], JwtTypes.WEB)
export class DisableOtpAuthController {
  constructor(
    @Inject(USER_TYPES.applications.ICheckPasswordUserApplication)
    private readonly checkPasswordUserApplication: ICheckPasswordUserApplication,
    @Inject(TYPES.services.IVerifyOtpAuthService)
    private verifyOtpService: IVerifyOtpAuthService,
    @Inject(TYPES.services.IDisableOtpAuthService)
    private disableOtpService: IDisableOtpAuthService,
    @Inject(TYPES.services.IValidateRecoveryKeysService)
    private validateRecoveryKeysService: IValidateRecoveryKeysService,
  ) {}

  @Post('/otp/disable')
  async handler(@Body() body: DisableOtpAuthDto, @LoggedUser() loggedUser: ReadUserDto): Promise<boolean> {

    await this.checkPasswordUserApplication.execute({
      username: loggedUser.username,
      password: body.confirm_password,
    });

    if (body.is_otp) {
      await this.verifyOtpService.execute(body.code, loggedUser.id)
    } else {
      await this.validateRecoveryKeysService.execute(loggedUser.id, body.code)
    }

    await this.disableOtpService.execute(loggedUser.id)
    
    return true
  }
}
