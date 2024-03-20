import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JWTPayload } from 'modules/jwt/domain/jwt-payload.auth.ov';
import { JWTResponse } from 'modules/jwt/domain/jwt-response.auth.ov';

import { ReadUserDto } from 'modules/user/dto';
import {
  ICheckPasswordUserApplication,
  TYPES as TYPES_USER,
} from 'modules/user/interfaces';

import TokenOptions from '../domain/token-options.auth';
import { IGenerateTokenAuthService } from '../interfaces';

@Injectable()
export class GenerateTokenAuthService implements IGenerateTokenAuthService {
  constructor(
    @Inject(TYPES_USER.applications.ICheckPasswordUserApplication)
    private checkPasswordUserApplication: ICheckPasswordUserApplication,
    private jwtService: JwtService,
  ) {}

  async execute(tokenOptions: TokenOptions): Promise<JWTResponse> {
    const payload: JWTPayload = { 
      userId: tokenOptions.user.id,
      type: tokenOptions.type
    };
    return {
      access_token: this.jwtService.sign(payload, { expiresIn: tokenOptions.expiresIn }),
    };
  }
}
