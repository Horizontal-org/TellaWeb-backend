import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';

import {
  ICheckPasswordUserApplication,
  TYPES as TYPES_USER,
} from 'modules/user/interfaces';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(TYPES_USER.applications.ICheckPasswordUserApplication)
    private readonly checkPasswordUserApplication: ICheckPasswordUserApplication,
  ) {
    super();
  }

  async validate(username: string, password: string) {
    const user = await this.checkPasswordUserApplication.execute({
      username,
      password,
    });

    return user;
  }
}
