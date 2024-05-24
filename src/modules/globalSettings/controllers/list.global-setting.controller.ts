import { Get, Inject, ParseArrayPipe, ParseIntPipe, Query } from '@nestjs/common';

import { ApiPaginatedResponse } from 'common/decorators/api-paginated.common.decorator';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

import { RolesUser } from 'modules/user/domain';

import { ReadGlobalSettingDto } from '../dto';
import { IListGlobalSettingService, TYPES } from '../interfaces';

@AuthController('global-setting', [RolesUser.ADMIN], JwtTypes.WEB)
export class ListGlobalSettingController {
  constructor(
    @Inject(TYPES.services.IListGlobalSettingService)
    private listGlobalSettingService: IListGlobalSettingService,
  ) {}

  @ApiPaginatedResponse(ReadGlobalSettingDto)
  @Get('')
  async handler(): Promise<ReadGlobalSettingDto[]> {
    const response = await this.listGlobalSettingService.execute();
    return response;
  }
}
