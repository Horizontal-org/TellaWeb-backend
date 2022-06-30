import { Get, Inject, ParseIntPipe, Query } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';

import { ApiPaginatedResponse } from 'common/decorators/api-paginated.common.decorator';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { PaginatedDto } from 'common/dto/paginated.common.dto';

import { RolesUser } from 'modules/user/domain';

import { ReadReportDto } from '../dto';
import { IListReportApplication, TYPES } from '../interfaces';

@AuthController('report', [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER])
@ApiExtraModels(PaginatedDto)
export class ListReportController {
  constructor(
    @Inject(TYPES.applications.IListReportApplication)
    private listReportApplication: IListReportApplication,
  ) {}

  @ApiPaginatedResponse(ReadReportDto)
  @Get('')
  async handler(
    @Query('limit', new ParseIntPipe()) limit = 0,
    @Query('offset', new ParseIntPipe()) offset = 0,
    @Query('sort') sort = '',
    @Query('order') order = '',
    @Query('search') search = '',
  ): Promise<PaginatedDto<ReadReportDto>> {
    const response = await this.listReportApplication.execute(
      limit,
      offset,
      sort,
      order,
      search,
    );
    return response;
  }
}
