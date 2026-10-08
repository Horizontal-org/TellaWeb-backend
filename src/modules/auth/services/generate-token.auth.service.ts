import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JWTPayload } from 'modules/jwt/domain/jwt-payload.auth.ov';
import { JWTResponse } from 'modules/jwt/domain/jwt-response.auth.ov';

import { ReadUserDto } from 'modules/user/dto';
import { UserEntity } from 'modules/user/domain';
import { BlockedUserException } from 'modules/user/exceptions';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
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
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(tokenOptions: TokenOptions): Promise<JWTResponse> {
    // Every login and refresh comes through here. A user blocked by suspicious
    // login detection gets no web token until they unblock from the email;
    // the mobile app isn't affected.
    if (tokenOptions.type === JwtTypes.WEB) {
      const blocked = await this.userRepository.count({
        where: { id: tokenOptions.user.id, blocked: true },
      });
      if (blocked) throw new BlockedUserException();
    }

    const payload: JWTPayload = {
      userId: tokenOptions.user.id,
      type: tokenOptions.type,
    };
    return {
      access_token: this.jwtService.sign(payload, {
        expiresIn: tokenOptions.expiresIn,
      }),
    };
  }
}
