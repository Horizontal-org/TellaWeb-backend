import { Body, Inject, Post } from '@nestjs/common';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { LoggedUser } from 'modules/auth/decorators';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { ReadUserDto } from 'modules/user/dto';
import { EnableOtpResponseAuthDto } from '../dto/enable-otp-response.auth.dto';
import { EnableOtpAuthDto } from '../dto/enable-otp.auth.dto';
import { IEnableOtpAuthService, TYPES } from '../interfaces';


@AuthController('auth', [], JwtTypes.WEB)
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
