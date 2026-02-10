import { Body, Controller, Inject, Post, Res, UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';
import { TYPES } from '../interfaces';
import { IGenerateTokenAuthService } from '../interfaces/services/generate-token.auth.service.interface';
import { IRefreshTokenAuthService } from '../interfaces/services/refresh-token.auth.service.interface';
import {
  IGetByIdUserApplication,
  TYPES as TYPES_USER,
} from 'modules/user/interfaces';
import { RefreshTokenAuthDto } from '../dto/refresh-token.auth.dto';

@Controller('auth')
export class RefreshTokenAuthController {
  constructor(
    @Inject(TYPES.services.IRefreshTokenAuthService)
    private refreshTokenService: IRefreshTokenAuthService,
    @Inject(TYPES.services.IGenerateTokenAuthService)
    private generateTokenAuthService: IGenerateTokenAuthService,
    @Inject(TYPES_USER.applications.IGetUserByIdApplication)
    private getByIdUserApplication: IGetByIdUserApplication,
  ) {}

  @Post('refresh')
  async refresh(
    @Body() body: RefreshTokenAuthDto,
    @Res() response: Response,
  ) {
    const result = await this.refreshTokenService.validate(body.refresh_token);
    if (!result) {
      throw new UnauthorizedException();
    }

    await this.refreshTokenService.revoke(body.refresh_token);

    const user = await this.getByIdUserApplication.execute(result.userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    const authToken = await this.generateTokenAuthService.execute({
      user,
      type: 'web',
      expiresIn: '15m',
    });

    const refreshToken = await this.refreshTokenService.generate(user.id);

    response
      .cookie('access_token', authToken.access_token, {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 15),
        domain: process.env.COOKIE_DOMAIN,
      })
      .send({
        access_token: authToken.access_token,
        refresh_token: refreshToken,
      });
  }
}
