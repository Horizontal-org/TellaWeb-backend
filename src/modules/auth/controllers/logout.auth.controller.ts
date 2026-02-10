import { Inject, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { TYPES } from '../interfaces';
import { IRefreshTokenAuthService } from '../interfaces/services/refresh-token.auth.service.interface';
import { LoggedUser } from '../decorators';
import { ReadUserDto } from 'modules/user/dto';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

@AuthController('auth', [], JwtTypes.WEB)
export class LogoutAuthController {
  constructor(
    @Inject(TYPES.services.IRefreshTokenAuthService)
    private refreshTokenService: IRefreshTokenAuthService,
  ) {}

  @Post('logout')
  async logout(
    @LoggedUser() user: ReadUserDto,
    @Res() response: Response,
  ) {
    await this.refreshTokenService.revokeAllForUser(user.id);

    response
      .clearCookie('access_token', {
        httpOnly: true,
        domain: process.env.COOKIE_DOMAIN,
      })
      .send({ success: true });
  }
}
