import { Get, Inject, ParseIntPipe, Query } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';

import { ApiPaginatedResponse } from 'common/decorators/api-paginated.common.decorator';
import { AuthController } from 'common/decorators/auth-controller.decorator';
import { PaginatedDto } from 'common/dto/paginated.common.dto';
import { LoggedUser } from 'modules/auth/decorators';
import { JwtTypes } from 'modules/jwt/domain/jwt-types.auth.enum';

import { RolesUser } from 'modules/user/domain';
import { ReadUserDto } from 'modules/user/dto';

import { ReadProjectDto } from '../dto';
import { IListProjectApplication, TYPES } from '../interfaces';

@AuthController('project', [RolesUser.ADMIN, RolesUser.EDITOR, RolesUser.VIEWER], JwtTypes.WEB)
@ApiExtraModels(PaginatedDto)
export class ListProjectController {
  constructor(
    @Inject(TYPES.applications.IListProjectApplication)
    private listProjectApplication: IListProjectApplication,
  ) {}

  @ApiPaginatedResponse(ReadProjectDto)
  @Get('')
  async handler(
    @LoggedUser() user: ReadUserDto,
    @Query('limit', new ParseIntPipe()) limit = 0,
    @Query('offset', new ParseIntPipe()) offset = 0,
    @Query('sort') sort = '',
    @Query('order') order = '',
    @Query('search') search = '',
  ): Promise<PaginatedDto<ReadProjectDto>> {
    const response = await this.listProjectApplication.execute(
      user,
      limit,
      offset,
      sort,
      order,
      search,
    );
    return response;
  }
}
