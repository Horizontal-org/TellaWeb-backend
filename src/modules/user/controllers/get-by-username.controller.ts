import { ForbiddenError } from '@casl/ability';
import { Get, Inject, Param } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AbilityFactory, Actions } from 'casl/casl-ability.factory';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { LoggedUser } from 'modules/auth/decorators';
import { RolesUser } from '../domain';

import { ReadUserDto } from '../dto';
import { IFindByUsernameUserApplication, TYPES } from '../interfaces';

@AuthController('user', [RolesUser.ADMIN])
export class GetByUsernameController {
  constructor(
    @Inject(TYPES.applications.IFindByUsernameUserApplication)
    private findByUserNameApplication: IFindByUsernameUserApplication,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  @ApiResponse({ type: ReadUserDto })
  @Get(':username')
  async handler(
    @Param('username') username: string,
    @LoggedUser() loggedUser: ReadUserDto,
  ): Promise<ReadUserDto> {
    const ability = this.abilityFactory.defineAbility(loggedUser);
    console.log(ability);

    const user = await this.findByUserNameApplication.execute(username);
    try {
      ForbiddenError.from(ability).throwUnlessCan(Actions.Read, user);
      return user;
    } catch (e) {
      throw e;
    }
  }
}
