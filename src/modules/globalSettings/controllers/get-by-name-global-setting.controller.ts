import { Get, Inject, Param } from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { RolesUser } from 'modules/user/domain';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';
import { IGetByNameGlobalSettingService, TYPES } from '../interfaces';
import { ReadGlobalSettingDto } from '../dto';

@AuthController('global-setting', [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER, RolesUser.REPORTER], JwtTypes.WEB)
export class GetByNameGlobalSettingController {
  constructor(
    @Inject(TYPES.services.IGetByNameGlobalSettingService)
    private getByNameGlobalSettingService: IGetByNameGlobalSettingService,
  ) {}

  @ApiOkResponse({ type: ReadGlobalSettingDto })
  @Get(':name')
  async handler(@Param('name') name: string) {
    return this.getByNameGlobalSettingService.execute(name);
  }
}
