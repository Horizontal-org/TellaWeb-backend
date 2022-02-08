import { Body, Inject, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';

import { RolesUser } from '../domain';
import { EditUserDto, ReadUserDto } from '../dto';
import { IEditUserApplication, TYPES } from '../interfaces';

@AuthController('user', [RolesUser.ADMIN])
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
    console.log(editUserDto);
    editUserDto.id = userId;
    const user = await this.editUserApplication.execute(editUserDto);

    return user;
  }
}
