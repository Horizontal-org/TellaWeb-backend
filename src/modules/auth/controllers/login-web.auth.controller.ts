import {
  Body,
  ConsoleLogger,
  Controller,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request, Response } from 'express';
import { LoginAuthDto } from '../domain/';
import {
  TYPES,
  IValidateAuthService,
  IGenerateTokenAuthService,
} from '../interfaces';
import { IRefreshTokenAuthService } from '../interfaces/services/refresh-token.auth.service.interface';
import {
  ICheckSuspiciousUserApplication,
  TYPES as USER_TYPES,
} from '../../user/interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { GlobalSettingEntity } from 'modules/globalSettings/domain';
import { Repository } from 'typeorm';
import { RolesUser } from 'modules/user/domain';
import { InvalidCredentailsUserException } from 'modules/user/exceptions';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

@Controller('login')
@UseGuards(ThrottlerGuard)
export class LoginWebAuthController {
  constructor(
    @Inject(USER_TYPES.applications.ICheckSuspiciousUserApplication)
    private checkSuspiciousApplication: ICheckSuspiciousUserApplication,
    @Inject(TYPES.services.IGenerateTokenAuthService)
    private generateTokenAuthService: IGenerateTokenAuthService,
    @Inject(TYPES.services.IValidateAuthService)
    private validateAuthService: IValidateAuthService,
    @InjectRepository(GlobalSettingEntity)
    private readonly globalSettingsRepo: Repository<GlobalSettingEntity>,
    @Inject(TYPES.services.IRefreshTokenAuthService)
    private refreshTokenService: IRefreshTokenAuthService,
  ) {}

  @Post('web')
  async login(
    @Req() req: Request,
    @Body() loginAuthDto: LoginAuthDto,
    @Res() response: Response,
  ) {
    const { username, password } = loginAuthDto;
    const user = await this.validateAuthService.execute({ username, password });

    if (user.role === RolesUser.REPORTER) {
      throw new InvalidCredentailsUserException();
    }

    // get emails enabled flag
    const gSetting = await this.globalSettingsRepo.findOne({
      where: { name: 'SUSPICIOUS LOGIN DETECTION' },
    });

    if (gSetting && gSetting.enabled) {
      // req.ip honours trust proxy; client-sent forwarding headers can't spoof it
      const ip = req.ip;
      const flagged = await this.checkSuspiciousApplication.execute(
        ip,
        user.id,
      );

      if (flagged) {
        response.send({
          flagged: true,
        });
        return;
      }
    }

    if (user.otp_active) {
      // minted only after the reporter and suspicious-login checks above
      const { access_token: mfa_token } =
        await this.generateTokenAuthService.execute({
          user,
          type: JwtTypes.MFA,
          expiresIn: '5m',
        });
      response.send({
        user: { otp_active: user.otp_active },
        mfa_token,
      });
    } else {
      const authToken = await this.generateTokenAuthService.execute({
        user: user,
        type: 'web',
        expiresIn: '15m',
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
    }
  }
}
