import { Body, Controller, Inject, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoginAuthDto } from '../domain/';
// import * as requestIp from 'request-ip';

import { version } from '../../../../package.json';

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
    @Body() loginAuthDto: LoginAuthDto, 
    @Res() response: Response,
  ) {

    const { username, password } = loginAuthDto;
    const user = await this.validateAuthService.execute({ username, password });
    const authToken = await this.generateTokenAuthService.execute({
      user: user,
      type: 'mobile',
      expiresIn: '1y'
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
        version,
      });    
  }
}
