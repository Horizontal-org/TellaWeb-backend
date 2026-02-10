import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { IGenerateTokenAuthService, TYPES } from '../interfaces';
import { IRefreshTokenAuthService } from '../interfaces/services/refresh-token.auth.service.interface';
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
    @Inject(TYPES.services.IRefreshTokenAuthService)
    private refreshTokenService: IRefreshTokenAuthService,
  ) {}

  @Post('/otp/login')
  async handler(@Body() body: LoginOtpAuthDto, @Res() response: Response): Promise<boolean> {
    await this.verifyOtpService.execute(body.code, body.userId)
    const user = await this.getByIdUserApplication.execute(body.userId)
    const authToken = await this.generateTokenAuthService.execute({
      user: user,
      type: 'web',
      expiresIn: '15m'
    });
    
    const refresh_token = await this.refreshTokenService.generate(user.id);

    response
      .cookie('access_token', authToken.access_token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 15),
        domain: process.env.COOKIE_DOMAIN,
      })
      .send({
        ...authToken,
        refresh_token,
        user,
      });
        
    return true
  }
}
