import { Get, Inject, Query, ParseIntPipe } from '@nestjs/common';
import { ApiPaginatedResponse } from 'common/decorators/api-paginated.common.decorator';
import { ApiExtraModels } from '@nestjs/swagger';

import { AuthController } from 'common/decorators/auth-controller.decorator';
import { ReadUserDto } from '../dto';
import { RolesUser } from 'modules/user/domain';
import { IListUserApplication, TYPES } from '../interfaces';
import { PaginatedDto } from 'common/dto/paginated.common.dto';

@AuthController('user', [RolesUser.ADMIN])
@ApiExtraModels(PaginatedDto)
export class ListUserController {
  constructor(
    @Inject(TYPES.applications.IListUserApplication)
    private listUserApplication: IListUserApplication,
  ) {}

  @ApiPaginatedResponse(ReadUserDto)
  @Get('list')
  async handler(
    @Query('limit', new ParseIntPipe()) limit = 0,
    @Query('offset', new ParseIntPipe()) offset = 0,
    @Query('sort') sort = '',
    @Query('order') order = '',
    @Query('search') search = '',
  ): Promise<PaginatedDto<ReadUserDto>> {
    const response = await this.listUserApplication.execute(
      limit,
      offset,
      sort,
      order,
      search,
    );

    return response;
  }
}
