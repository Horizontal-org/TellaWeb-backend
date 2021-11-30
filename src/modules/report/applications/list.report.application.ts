import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { PaginatedDto } from 'common/dto/paginated.common.dto';

import { ReadReportDto } from '../dto';
import {
  TYPES,
  IListReportApplication,
  IListReportService,
} from '../interfaces';

@Injectable()
export class ListReportApplication implements IListReportApplication {
  constructor(
    @Inject(TYPES.services.IListReportService)
    private readonly listReportService: IListReportService,
  ) {}

  async execute(
    take: number,
    skip: number,
    sort: string,
    order: string,
    search: string,
  ): Promise<PaginatedDto<ReadReportDto>> {
    const { results: reports, total } = await this.listReportService.execute(
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
      results: reports.map((report) => plainToClass(ReadReportDto, report)),
    };
  }
}
