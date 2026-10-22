import {
  Get,
  Inject,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';

import { ApiPaginatedResponse } from 'common/decorators/api-paginated.common.decorator';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { PaginatedDto } from 'common/dto/paginated.common.dto';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

import { RolesUser } from 'modules/user/domain';

import { ReadResourceDto } from '../dto';
import { IListResourceService, TYPES } from '../interfaces';

// The resources of one project. ProjectAccessGuard ('id') lets admins through
// and everyone else only into projects they are a member of
@AuthController(
  'resource',
  [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER],
  JwtTypes.WEB,
  'id',
)
@ApiExtraModels(PaginatedDto)
export class ListByProjectResourceController {
  constructor(
    @Inject(TYPES.services.IListResourceService)
    private listResourceService: IListResourceService,
  ) {}

  @ApiPaginatedResponse(ReadResourceDto)
  @Get('project/:projectId')
  async handler(
    @Param('projectId', new ParseUUIDPipe()) projectId: string,
    @Query('limit', new ParseIntPipe()) limit = 0,
    @Query('offset', new ParseIntPipe()) offset = 0,
    @Query('sort') sort = '',
    @Query('order') order = '',
    @Query('search') search = '',
  ): Promise<PaginatedDto<ReadResourceDto>> {
    return this.listResourceService.execute(
      limit,
      offset,
      sort,
      order,
      search,
      [],
      projectId,
    );
  }
}
