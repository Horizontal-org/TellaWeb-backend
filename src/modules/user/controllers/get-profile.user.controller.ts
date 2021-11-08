import { Get } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { LoggedUser } from 'modules/auth/decorators';

import { ReadUserDto } from '../dto';

@AuthController('user')
export class GetProfileUserController {
  @ApiResponse({ type: ReadUserDto })
  @Get('')
  async handler(@LoggedUser() author: ReadUserDto): Promise<ReadUserDto> {
    return author;
  }
}
