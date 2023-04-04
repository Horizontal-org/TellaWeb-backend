import { Body, Inject, Post } from '@nestjs/common';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { LoggedUser } from 'modules/auth/decorators';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { ReadUserDto } from 'modules/user/dto';
import { OtpCodeAuthDto } from '../dto/otp-code.auth.dto';
import { TYPES } from '../interfaces';
import { IVerifyOtpAuthService } from '../interfaces/services/verify-otp.auth.service.interface';


@AuthController('auth', [], JwtTypes.WEB)
export class VerifyOtpAuthController {
  constructor(
    @Inject(TYPES.services.IVerifyOtpAuthService)
    private verifyOtpService: IVerifyOtpAuthService,
  ) {}

  @Post('/otp/verify')
  async handler(@Body() body: OtpCodeAuthDto, @LoggedUser() loggedUser: ReadUserDto): Promise<boolean> {
    await this.verifyOtpService.execute(body.code, loggedUser.id)

    return true
  }
}
