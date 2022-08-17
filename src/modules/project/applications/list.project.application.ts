import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { PaginatedDto } from 'common/dto/paginated.common.dto';

import { ReadProjectDto } from '../dto';
import {
  TYPES,
  IListProjectApplication,
  IListProjectService,
} from '../interfaces';

@Injectable()
export class ListProjectApplication implements IListProjectApplication {
  constructor(
    @Inject(TYPES.services.IListProjectService)
    private readonly listProjectService: IListProjectService,
  ) {}

  async execute(
    take: number,
    skip: number,
    sort: string,
    order: string,
    search: string,
  ): Promise<PaginatedDto<ReadProjectDto>> {
    const { results: projects, total } = await this.listProjectService.execute(
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
      results: projects.map((project) => plainToClass(ReadProjectDto, project)),
    };
  }
}
