import { ForbiddenError } from '@casl/ability';
import { Get, Inject, Param, UnauthorizedException } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AbilityFactory, Actions } from 'casl/casl-ability.factory';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { LoggedUser } from 'modules/auth/decorators';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { RolesUser } from '../domain';

import { ReadUserDto } from '../dto';
import { IFindByUsernameUserApplication, TYPES } from '../interfaces';

@AuthController('user', [RolesUser.ADMIN], JwtTypes.WEB)
export class GetByUsernameController {
  constructor(
    @Inject(TYPES.applications.IFindByUsernameUserApplication)
    private findByUserNameApplication: IFindByUsernameUserApplication,
  ) {}

  @ApiResponse({ type: ReadUserDto })
  @Get(':username')
  async handler(
    @Param('username') username: string,
  ): Promise<ReadUserDto> {
    const user = await this.findByUserNameApplication.execute(username);
    return user
  }
}
