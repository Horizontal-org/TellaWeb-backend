import { Get, Inject, ParseArrayPipe, ParseIntPipe, Query } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';

import { ApiPaginatedResponse } from 'common/decorators/api-paginated.common.decorator';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { PaginatedDto } from 'common/dto/paginated.common.dto';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

import { RolesUser } from 'modules/user/domain';

import { ReadResourceDto } from '../dto';
import { IListResourceService, TYPES } from '../interfaces';

@AuthController('resource', [RolesUser.ADMIN, RolesUser.EDITOR], JwtTypes.WEB)
@ApiExtraModels(PaginatedDto)
export class ListResourceController {
  constructor(
    @Inject(TYPES.services.IListResourceService)
    private listResourceService: IListResourceService,
  ) {}

  @ApiPaginatedResponse(ReadResourceDto)
  @Get('')
  async handler(
    @Query('limit', new ParseIntPipe()) limit = 0,
    @Query('offset', new ParseIntPipe()) offset = 0,
    @Query('sort') sort = '',
    @Query('order') order = '',
    @Query('search') search = '',
    @Query('exclude', new ParseArrayPipe({ optional: true })) exclude = [],
  ): Promise<PaginatedDto<ReadResourceDto>> {
    const response = await this.listResourceService.execute(
      limit,
      offset,
      sort,
      order,
      search,
      exclude
    );
    return response;
  }
}
