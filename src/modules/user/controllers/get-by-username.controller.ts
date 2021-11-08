import { Get, Inject, Param } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { RolesUser } from '../domain';

import { ReadUserDto } from '../dto';
import { IFindByUsernameUserApplication, TYPES } from '../interfaces';

@AuthController('user', [RolesUser.ADMIN])
export class GetByUsernameController {
  constructor(
    @Inject(TYPES.applications.IFindByUsernameUserApplication)
    private findByUserNameApplication: IFindByUsernameUserApplication,
  ) {}

  @ApiResponse({ type: ReadUserDto })
  @Get(':username')
  async handler(@Param('username') username: string): Promise<ReadUserDto> {
    const user = await this.findByUserNameApplication.execute(username);
    return user;
  }
}
