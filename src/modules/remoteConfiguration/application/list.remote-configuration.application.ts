import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { PaginatedDto } from 'common/dto/paginated.common.dto';
import { ReadRemoteConfigurationDto } from '../dto';

import {
  TYPES,
  IListRemoteConfigurationApplication,
  IListRemoteConfigurationService,
} from '../interfaces';

@Injectable()
export class ListRemoteConfigurationApplication
  implements IListRemoteConfigurationApplication {
  constructor(
    @Inject(TYPES.services.IListRemoteConfigurationService)
    private readonly listRemoteConfigurationService: IListRemoteConfigurationService,
  ) {}

  async execute(
    take: number,
    skip: number,
  ): Promise<PaginatedDto<ReadRemoteConfigurationDto>> {
    const {
      results,
      total,
    } = await this.listRemoteConfigurationService.execute(take, skip);

    return {
      limit: take,
      offset: skip,
      total: total,
      results: results.map((configuration) =>
        plainToClass(ReadRemoteConfigurationDto, configuration),
      ),
    };
  }
}
