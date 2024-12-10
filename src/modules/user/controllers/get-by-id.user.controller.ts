import { ForbiddenError } from '@casl/ability';
import { Get, Inject, Param, UnauthorizedException } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AbilityFactory, Actions } from 'casl/casl-ability.factory';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { LoggedUser } from 'modules/auth/decorators';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { RolesUser } from '../domain';

import { ReadUserDto } from '../dto';
import { IGetByIdUserApplication, TYPES } from '../interfaces';

@AuthController('user', [RolesUser.ADMIN], JwtTypes.WEB)
export class GetByIdController {
  constructor(
    @Inject(TYPES.applications.IGetUserByIdApplication)
    private findByIdApplication: IGetByIdUserApplication,
  ) {}

  @ApiResponse({ type: ReadUserDto })
  @Get(':id')
  async handler(
    @Param('id') id: string,
  ): Promise<ReadUserDto> {
    const user = await this.findByIdApplication.execute(id);
    return user
  }
}
