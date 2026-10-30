import { Get, Inject, Query } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';

import { ApiPaginatedResponse } from 'common/decorators/api-paginated.common.decorator';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { PaginatedDto } from 'common/dto/paginated.common.dto';
import { NonNegativeIntPipe } from 'common/pipes/non-negative-int.pipe';
import { LoggedUser } from 'modules/auth/decorators';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

import { RolesUser } from 'modules/user/domain';
import { ReadUserDto } from 'modules/user/dto';

import { ReadReportDto } from '../dto';
import { IListReportApplication, TYPES } from '../interfaces';

@AuthController(
  'report',
  [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER],
  JwtTypes.WEB,
)
@ApiExtraModels(PaginatedDto)
export class ListReportController {
  constructor(
    @Inject(TYPES.applications.IListReportApplication)
    private listReportApplication: IListReportApplication,
  ) {}

  @ApiPaginatedResponse(ReadReportDto)
  @Get('')
  async handler(
    @LoggedUser() user: ReadUserDto,
    @Query('limit', new NonNegativeIntPipe()) limit = 0,
    @Query('offset', new NonNegativeIntPipe()) offset = 0,
    @Query('sort') sort = '',
    @Query('order') order = '',
    @Query('search') search = '',
    @Query('projectId') projectId = '',
  ): Promise<PaginatedDto<ReadReportDto>> {
    const response = await this.listReportApplication.execute(
      limit,
      offset,
      sort,
      order,
      search,
      projectId,
      user,
    );
    return response;
  }
}
