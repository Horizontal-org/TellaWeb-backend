import { ForbiddenError } from '@casl/ability';
import { Body, Inject, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { AbilityFactory, Actions } from 'casl/casl-ability.factory';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { LoggedUser } from 'modules/auth/decorators';

import { EditUserDto, ReadUserDto } from '../dto';
import { IEditUserApplication, TYPES } from '../interfaces';

@AuthController('user')
export class EditUserController {
  constructor(
    @Inject(TYPES.applications.IEditUserApplication)
    private readonly editUserApplication: IEditUserApplication,
    private readonly abilityFactory: AbilityFactory,
  ) {}

  @ApiResponse({ type: ReadUserDto })
  @Post(':userId')
  async handler(
    @Body() editUserDto: Partial<EditUserDto>,
    @Param('userId', new ParseUUIDPipe()) userId: string,
    @LoggedUser() loggedUser: ReadUserDto,
  ): Promise<ReadUserDto> {
    editUserDto.id = userId;

    const ability = this.abilityFactory.defineAbility(loggedUser);

    ForbiddenError.from(ability).throwUnlessCan(
      Actions.Update,
      Object.assign(new ReadUserDto(), editUserDto),
    );

    const user = await this.editUserApplication.execute(editUserDto);

    return user;
  }
}
