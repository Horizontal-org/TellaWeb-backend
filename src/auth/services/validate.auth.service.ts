import { Inject, Injectable } from '@nestjs/common';
import { IValidateAuthService } from 'auth/interfaces/services/validate.auth.services.interface';
import { TYPES as TYPES_USER } from 'user/interfaces/types';
import { User } from 'user/domain/user.entity';
import { IFindByUsernameUserApplication } from 'user/interfaces/applications/find-by-username.user.application.interface';
import { comparePassword } from 'common/utils/password.utils';

@Injectable()
export class ValidateAuthService implements IValidateAuthService<User> {
  constructor(
    @Inject(TYPES_USER.applications.IFindByUsernameUserApplication)
    private readonly findByUsernameUserApplication: IFindByUsernameUserApplication,
  ) {}

  async execute(username: string, pass: string): Promise<User | null> {
    const user = await this.findByUsernameUserApplication.execute(username);
    if (user && (await comparePassword(pass, user.password))) {
      return user;
    }
    return null;
  }
}
