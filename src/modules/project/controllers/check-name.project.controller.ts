import { Get, Inject, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { RolesUser } from 'modules/user/domain';
import { ICheckNameProjectService, TYPES } from '../interfaces';

@AuthController('project', [RolesUser.ADMIN, RolesUser.EDITOR], JwtTypes.WEB)
export class CheckNameProjectController {
  constructor(
    @Inject(TYPES.services.ICheckNameProjectService)
    private readonly checkNameService: ICheckNameProjectService,
  ) {}

  @ApiOkResponse({ schema: { example: { taken: true } } })
  @Get('check/:name')
  async handler(
    @Param('name') name: string,
    @Query('excludeId', new ParseUUIDPipe({ optional: true }))
    excludeId?: string,
  ) {
    return { taken: await this.checkNameService.execute(name, excludeId) };
  }
}
