import { Inject } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { ReadUserDto } from '../dto';
import { TYPES, IListUserService, IListUserApplication } from '../interfaces';
import { PaginatedDto } from 'common/dto/paginated.common.dto';

export class ListUserApplication implements IListUserApplication {
  constructor(
    @Inject(TYPES.services.IListUserService)
    private readonly listUserService: IListUserService,
  ) {}

  async execute(
    take: number,
    skip: number,
    sort: string,
    order: string,
    search: string,
    exclude: Array<string>
  ): Promise<PaginatedDto<ReadUserDto>> {
    const { results: users, total } = await this.listUserService.execute(
      take,
      skip,
      sort,
      order,
      search,
      exclude
    );

    return {
      limit: take,
      offset: skip,
      total: total,
      results: users.map((user) => plainToClass(ReadUserDto, user)),
    };
  }
}
