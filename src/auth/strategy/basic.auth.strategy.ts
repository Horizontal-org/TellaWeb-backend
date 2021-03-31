import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';
import { TYPES } from 'auth/interfaces/types';
import { IValidateAuthService } from 'auth/interfaces/services/validate.auth.services.interface';
import { User } from 'user/domain/user.entity';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(TYPES.services.IValidateAuthService)
    private readonly validateAuthService: IValidateAuthService<User>,
  ) {
    super();
  }

  async validate(username: string, password: string) {
    console.log(username, password);
    const user = await this.validateAuthService.execute(username, password);
    return user;
  }
}
