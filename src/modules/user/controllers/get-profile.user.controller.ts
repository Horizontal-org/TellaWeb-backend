import { ForbiddenError } from '@casl/ability';
import { Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { LoggedUser } from 'modules/auth/decorators';
import { AbilityFactory, Actions } from 'casl/casl-ability.factory';

import { ReadUserDto } from '../dto';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

@AuthController('user', [], JwtTypes.ALL)
export class GetProfileUserController {
  constructor() {}

  @ApiResponse({ type: ReadUserDto })
  @Get('')
  async handler(@LoggedUser() user: ReadUserDto): Promise<ReadUserDto> {
    return user;    
  }
}
