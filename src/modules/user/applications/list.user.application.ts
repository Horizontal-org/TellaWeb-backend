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
  ): Promise<PaginatedDto<ReadUserDto>> {
    const { results: reports, total } = await this.listUserService.execute(
      take,
      skip,
      sort,
      order,
      search,
    );

    return {
      limit: take,
      offset: skip,
      total: total,
      results: reports.map((report) => plainToClass(ReadUserDto, report)),
    };
  }
}
