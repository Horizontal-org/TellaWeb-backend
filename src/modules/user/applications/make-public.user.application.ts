import { Inject, Injectable } from '@nestjs/common';
import { classToPlain, plainToClass } from 'class-transformer';
import { hashPassword } from 'common/utils/password.utils';
import { RolesUser } from '../domain';

import { EditUserDto, ReadUserDto } from '../dto';
import { AdminCantBePublicUserException } from '../exceptions/admin-not-public.user.exception';
import {
  TYPES,
  IFindByUsernameUserService,
  ICreateUserService,
  IEditUserService,
} from '../interfaces';
import { IMakePublicUserApplication } from '../interfaces';

@Injectable()
export class MakePublicUserApplication implements IMakePublicUserApplication {
  constructor(
    @Inject(TYPES.services.IFindByUsernameUserService)
    private readonly findByUsernameUserService: IFindByUsernameUserService,
    @Inject(TYPES.services.ICreateUserService)
    private readonly createUserService: ICreateUserService,
    @Inject(TYPES.services.IEditUserService)
    private readonly editUserService: IEditUserService,
  ) {}

  async execute(username: string): Promise<ReadUserDto> {
    try {
      const user = await this.findByUsernameUserService.execute(username);
      if (user.role === RolesUser.ADMIN)
        throw new AdminCantBePublicUserException();
      user.password = await hashPassword(username);
      const updatedUser = await this.editUserService.execute(
        plainToClass(EditUserDto, user),
      );
      return plainToClass(ReadUserDto, updatedUser);
    } catch (error) {
      if (error instanceof AdminCantBePublicUserException) throw error;

      const userCreated = this.createUserService.execute({
        username,
        password: username,
        isAdmin: false,
      });
      return plainToClass(ReadUserDto, userCreated);
    }
  }
}
