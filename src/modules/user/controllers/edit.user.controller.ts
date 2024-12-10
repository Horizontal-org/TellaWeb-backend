import { ForbiddenError } from '@casl/ability';
import { Body, Inject, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AbilityFactory, Actions } from 'casl/casl-ability.factory';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { LoggedUser } from 'modules/auth/decorators';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

import { EditUserDto, ReadUserDto } from '../dto';
import { IEditUserApplication, TYPES } from '../interfaces';
import { RolesUser } from '../domain';
import { hashPassword } from 'common/utils/password.utils';

@AuthController('user', [RolesUser.ADMIN], JwtTypes.WEB)
export class EditUserController {
  constructor(
    @Inject(TYPES.applications.IEditUserApplication)
    private readonly editUserApplication: IEditUserApplication,
  ) {}

  @ApiResponse({ type: ReadUserDto })
  @Post(':userId')
  async handler(
    @Body() editUserDto: Partial<EditUserDto>,
    @Param('userId', new ParseUUIDPipe()) userId: string,
  ): Promise<ReadUserDto> {
    editUserDto.id = userId;
    editUserDto.password = editUserDto.password ? await hashPassword(editUserDto.password) : null
    const user = await this.editUserApplication.execute(editUserDto);

    return user;
  }
}
