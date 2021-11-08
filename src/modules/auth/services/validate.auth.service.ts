import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';

import { ReadUserDto } from 'modules/user/dto';
import {
  ICheckPasswordUserApplication,
  TYPES as TYPES_USER,
} from 'modules/user/interfaces';

import { LoginAuthDto } from '../domain';
import { IValidateAuthService } from '../interfaces';

@Injectable()
export class ValidateAuthService implements IValidateAuthService {
  constructor(
    @Inject(TYPES_USER.applications.ICheckPasswordUserApplication)
    private checkPasswordUserApplication: ICheckPasswordUserApplication,
  ) {}

  async execute({ username, password }: LoginAuthDto): Promise<ReadUserDto> {
    try {
      const user = await this.checkPasswordUserApplication.execute({
        username,
        password,
      });
      return user;
    } catch (_) {
      throw new UnauthorizedException();
    }
  }
}
