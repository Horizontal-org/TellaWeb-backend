import { Body, Inject, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { hashPassword } from 'common/utils/password.utils';
import { LoggedUser } from 'modules/auth/decorators';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

import { RolesUser } from '../domain';
import { ReadUserDto, ChangePasswordUserDto } from '../dto';
import {
  TYPES,
  ICheckPasswordUserApplication,
  IEditUserApplication,
} from '../interfaces';
import { EditSelfUserDto } from '../dto/edit-self.user.dto';

@AuthController('user', [RolesUser.VIEWER, RolesUser.EDITOR, RolesUser.ADMIN], JwtTypes.WEB)
export class EditSelfUserController {
  constructor(    
    @Inject(TYPES.applications.IEditUserApplication)
    private readonly editUserApplication: IEditUserApplication,
  ) {}

  @ApiResponse({ type: ReadUserDto })
  @Post('change-self')
  async handler(
    @LoggedUser() { id, username, role }: ReadUserDto,
    @Body() editSelfUserDto: EditSelfUserDto,
  ): Promise<ReadUserDto> {    
    const user = await this.editUserApplication.execute({
      id,
      ...editSelfUserDto
    });

    return user;
  }
}
