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
import { InjectRepository } from '@nestjs/typeorm';
import { GlobalSettingEntity } from 'modules/globalSettings/domain';
import { Repository } from 'typeorm';

@Controller('login')
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
  ) {}

  @Post('web')
  async login(
    @Req() req: Request,
    @Body() loginAuthDto: LoginAuthDto, 
    @Res() response: Response,
  ) {
    
    const { username, password } = loginAuthDto;
    const user = await this.validateAuthService.execute({ username, password });

    
    // get emails enabled flag
    const gSetting = await this.globalSettingsRepo.findOne({
      where: { name: 'EMAILS' }
    });
    

    if (gSetting && gSetting.enabled) {
      const ip = requestIp.getClientIp(req)
      const flagged = await this.checkSuspiciousApplication.execute(ip, user.id)
  
      if (flagged) {
        response.send({
          flagged: true
        })
        return 
      }
    }
    
    if (user.otp_active) {
      response.send({
        user: {
          id: user.id,
          otp_active: user.otp_active
        }
      })
    } else {
      const authToken = await this.generateTokenAuthService.execute({
        user: user,
        type: 'web',
        expiresIn: '1d'
      });
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
