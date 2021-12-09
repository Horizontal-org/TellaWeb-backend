import { Body, Inject, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { hashPassword } from 'common/utils/password.utils';
import { LoggedUser } from 'modules/auth/decorators';

import { RolesUser } from '../domain';
import { ReadUserDto, ChangePasswordUserDto } from '../dto';
import {
  TYPES,
  ICheckPasswordUserApplication,
  IEditUserApplication,
} from '../interfaces';

@AuthController('user', [RolesUser.ADMIN])
export class ChangePasswordUserController {
  constructor(
    @Inject(TYPES.applications.ICheckPasswordUserApplication)
    private readonly checkPasswordUserApplication: ICheckPasswordUserApplication,
    @Inject(TYPES.applications.IEditUserApplication)
    private readonly editUserApplication: IEditUserApplication,
  ) {}

  @ApiResponse({ type: Boolean })
  @Post('change-password')
  async handler(
    @LoggedUser() { id, username, role }: ReadUserDto,
    @Body() changePasswordUserDto: ChangePasswordUserDto,
  ): Promise<boolean> {
    await this.checkPasswordUserApplication.execute({
      username,
      password: changePasswordUserDto.current,
    });

    await this.editUserApplication.execute({
      id,
      password: await hashPassword(changePasswordUserDto.new),
      isAdmin: role === RolesUser.ADMIN,
    });

    return true;
  }
}
