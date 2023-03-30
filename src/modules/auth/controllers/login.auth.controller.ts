import { MailerService } from '@nestjs-modules/mailer';
import { Body, ConsoleLogger, Controller, Inject, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoginAuthDto } from '../domain/';
import * as requestIp from 'request-ip';
import {
  TYPES,
  IValidateAuthService,
  IGenerateTokenAuthService,
} from '../interfaces';
import { ICheckSuspiciousUserApplication, TYPES as USER_TYPES } from '../../user/interfaces'

@Controller('login')
export class LoginAuthController {
  constructor(
    @Inject(USER_TYPES.applications.ICheckSuspiciousUserApplication)
    private checkSuspiciousApplication: ICheckSuspiciousUserApplication,
    @Inject(TYPES.services.IGenerateTokenAuthService)
    private generateTokenAuthService: IGenerateTokenAuthService,
    @Inject(TYPES.services.IValidateAuthService)
    private validateAuthService: IValidateAuthService,
    
  ) {}

  @Post()
  async login(
    @Req() req: Request,
    @Body() loginAuthDto: LoginAuthDto, 
    @Res() response: Response,
  ) {

    const ip = requestIp.getClientIp(req)
    const { username, password } = loginAuthDto;
    const user = await this.validateAuthService.execute({ username, password });
    const flagged = await this.checkSuspiciousApplication.execute(ip, user.id)

    if (flagged) {
      response.send({
        flagged: true
      })
      return 
    }
    
    if (user.otp_active) {
      response.send({
        user: {
          id: user.id,
          otp_active: user.otp_active
        }
      })
    } else {
      const authToken = await this.generateTokenAuthService.execute(user);
      response
        .cookie('access_token', authToken.access_token, {
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
          domain: process.env.COOKIE_DOMAIN,
        })
        .send({
          ...authToken,
          user,
        });
    }

  }
}
