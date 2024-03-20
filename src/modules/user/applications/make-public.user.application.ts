import { Inject, Injectable } from '@nestjs/common';
import { classToPlain, plainToClass } from 'class-transformer';
import { hashPassword } from 'common/utils/password.utils';
import { create, update } from 'lodash';
import { RolesUser, UserEntity } from '../domain';

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
    let user = new UserEntity();
    try {
      user = await this.findByUsernameUserService.execute(username);
    } catch (_) {
      //do nothing
    }

    const publicUser = await (user.id
      ? this.update(user)
      : this.create(username));

    return plainToClass(ReadUserDto, publicUser);
  }

  private async create(username: string): Promise<UserEntity> {
    const password = await hashPassword(username);
    return this.createUserService.execute({
      username,
      password,
      role: RolesUser.VIEWER,
    });
  }

  private async update(user: UserEntity): Promise<UserEntity> {
    if (user.role === RolesUser.ADMIN)
      throw new AdminCantBePublicUserException();
    user.password = await hashPassword(user.username);
    const userDto = plainToClass(EditUserDto, user);
    return await this.editUserService.execute(userDto);
  }
}
