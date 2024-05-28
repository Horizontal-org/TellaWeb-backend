import { Body, Get, Inject, ParseArrayPipe, ParseIntPipe, Put, Query } from '@nestjs/common';

import { ApiPaginatedResponse } from 'common/decorators/api-paginated.common.decorator';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

import { RolesUser } from 'modules/user/domain';

import { ReadGlobalSettingDto } from '../dto';
import { IListGlobalSettingService, IUpdateGlobalSettingService, TYPES } from '../interfaces';
import { UpdateGlobalSettingDto } from '../dto/update.global-settings.dto';

@AuthController('global-setting', [RolesUser.ADMIN], JwtTypes.WEB)
export class UpdateGlobalSettingController {
  constructor(
    @Inject(TYPES.services.IUpdateGlobalSettingService)
    private updateGlobalSettingService: IUpdateGlobalSettingService,
  ) {}

  @Put('')
  async handler(@Body() updateDto: UpdateGlobalSettingDto): Promise<void> {
    await this.updateGlobalSettingService.execute(updateDto.id, updateDto.enabled);
    return;
  }
}
