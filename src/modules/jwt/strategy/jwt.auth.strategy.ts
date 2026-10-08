import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';

import {
  IGetByIdUserApplication,
  TYPES as TYPES_USER,
} from 'modules/user/interfaces';
import { JWTPayload } from '../domain/jwt-payload.auth.ov';
import { ReadUserDto } from 'modules/user/dto';
import { UserEntity } from 'modules/user/domain';
import { JwtTypes } from '../domain/jwt-types.auth.enum';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(TYPES_USER.applications.IGetUserByIdApplication)
    private readonly getByIdUserApplication: IGetByIdUserApplication,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: (req: Request) => {
        if (req?.cookies?.['access_token']) return req.cookies['access_token'];
        return ExtractJwt.fromAuthHeaderAsBearerToken()(req);
      },
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: JWTPayload): Promise<ReadUserDto> {
    const user = await this.getByIdUserApplication.execute(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    // web sessions of a blocked user stop working (mobile ones don't); the
    // web app then tries a refresh, which is refused with a 403
    if (payload.type === JwtTypes.WEB) {
      const blocked = await this.userRepository.count({
        where: { id: user.id, blocked: true },
      });
      if (blocked) throw new UnauthorizedException();
    }
    return user;
  }
}
