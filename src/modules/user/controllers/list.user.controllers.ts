import {
  Get,
  Inject,
  Query,
  ParseArrayPipe,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiPaginatedResponse } from 'common/decorators/api-paginated.common.decorator';
import { ApiExtraModels } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { ReadUserDto } from '../dto';
import { RolesUser } from 'modules/user/domain';
import { IListUserApplication, TYPES } from '../interfaces';
import { PaginatedDto } from 'common/dto/paginated.common.dto';
import { NonNegativeIntPipe } from 'common/pipes/non-negative-int.pipe';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

@AuthController('user', [RolesUser.ADMIN], JwtTypes.WEB)
@ApiExtraModels(PaginatedDto)
export class ListUserController {
  constructor(
    @Inject(TYPES.applications.IListUserApplication)
    private listUserApplication: IListUserApplication,
  ) {}

  @ApiPaginatedResponse(ReadUserDto)
  @Get('list')
  async handler(
    @Query('limit', new NonNegativeIntPipe()) limit = 0,
    @Query('offset', new NonNegativeIntPipe()) offset = 0,
    @Query('sort') sort = '',
    @Query('order') order = '',
    @Query('search') search = '',
    @Query('exclude', new ParseArrayPipe({ optional: true })) exclude = [],
    @Query('projectId') projectId = '',
    @Query('excludeProject', new ParseUUIDPipe({ optional: true }))
    excludeProject?: string,
  ): Promise<PaginatedDto<ReadUserDto>> {
    const response = await this.listUserApplication.execute(
      limit,
      offset,
      sort,
      order,
      search,
      exclude,
      projectId,
      excludeProject,
    );

    return response;
  }
}
