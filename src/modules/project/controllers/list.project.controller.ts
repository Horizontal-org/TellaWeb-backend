import { Get, Inject, ParseIntPipe, Query } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';

import { ApiPaginatedResponse } from 'common/decorators/api-paginated.common.decorator';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { PaginatedDto } from 'common/dto/paginated.common.dto';

import { RolesUser } from 'modules/user/domain';

import { ReadProjectDto } from '../dto';
import { IListProjectApplication, TYPES } from '../interfaces';

@AuthController('project', [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER])
@ApiExtraModels(PaginatedDto)
export class ListProjectController {
  constructor(
    @Inject(TYPES.applications.IListProjectApplication)
    private listProjectApplication: IListProjectApplication,
  ) {}

  @ApiPaginatedResponse(ReadProjectDto)
  @Get('')
  async handler(
    @Query('limit', new ParseIntPipe()) limit = 0,
    @Query('offset', new ParseIntPipe()) offset = 0,
    @Query('sort') sort = '',
    @Query('order') order = '',
    @Query('search') search = '',
  ): Promise<PaginatedDto<ReadProjectDto>> {
    const response = await this.listProjectApplication.execute(
      limit,
      offset,
      sort,
      order,
      search,
    );
    return response;
  }
}
