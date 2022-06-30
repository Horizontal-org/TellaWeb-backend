import { Get, Inject, ParseIntPipe, Query } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';

import { ApiPaginatedResponse } from 'common/decorators/api-paginated.common.decorator';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { PaginatedDto } from 'common/dto/paginated.common.dto';

import { RolesUser } from 'modules/user/domain';
import { ReadRemoteConfigurationDto } from '../dto';

import { IListRemoteConfigurationApplication, TYPES } from '../interfaces';

@AuthController('config')
@ApiExtraModels(PaginatedDto)
export class ListRemoteConfigurationController {
  constructor(
    @Inject(TYPES.applications.IListRemoteConfigurationApplication)
    private listRemoteConfigurationApplication: IListRemoteConfigurationApplication,
  ) {}

  @ApiPaginatedResponse(ReadRemoteConfigurationDto)
  @Get('')
  async handler(
    @Query('limit', new ParseIntPipe()) limit = 0,
    @Query('offset', new ParseIntPipe()) offset = 0,
  ): Promise<PaginatedDto<ReadRemoteConfigurationDto>> {
    const response = await this.listRemoteConfigurationApplication.execute(
      limit,
      offset,
    );
    return response;
  }
}
