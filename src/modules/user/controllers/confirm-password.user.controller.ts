import { Body, Inject, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { hashPassword } from 'common/utils/password.utils';
import { LoggedUser } from 'modules/auth/decorators';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

import { RolesUser } from '../domain';
import { ReadUserDto, ChangePasswordUserDto } from '../dto';
import { ConfirmPasswordUserDto } from '../dto/confirm-password.user.dto';
import {
  TYPES,
  ICheckPasswordUserApplication,
  IEditUserApplication,
} from '../interfaces';

@AuthController('user', [], JwtTypes.WEB)
export class ConfirmPasswordUserController {
  constructor(
    @Inject(TYPES.applications.ICheckPasswordUserApplication)
    private readonly checkPasswordUserApplication: ICheckPasswordUserApplication,
      ) {}

  @ApiResponse({ type: Boolean })
  @Post('/confirm/password')
  async handler(@Body() confirmPasswordUserDto: ConfirmPasswordUserDto, @LoggedUser() loggedUser: ReadUserDto): Promise<boolean> {
    await this.checkPasswordUserApplication.execute({
      username: loggedUser.username,
      password: confirmPasswordUserDto.current,
    });

    return true;
  }
}
