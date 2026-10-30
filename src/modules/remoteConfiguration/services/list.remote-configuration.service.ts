import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PartialResult } from 'common/dto/partial-result.common.dto';
import { applySort, SortableColumns } from 'common/utils/sort.utils';
import { Repository } from 'typeorm';
import { RemoteConfigurationEntity } from '../domain';
import { IListRemoteConfigurationService } from '../interfaces';

// The web app sends `configuration.*` (its column keys); the query alias is remote_configuration
const SORTABLE: SortableColumns = {
  'configuration.name': 'remote_configuration.name',
  'configuration.createdAt': 'remote_configuration.createdAt',
};

@Injectable()
export class ListRemoteConfigurationService implements IListRemoteConfigurationService {
  constructor(
    @InjectRepository(RemoteConfigurationEntity)
    private remoteConfigurationRepository: Repository<RemoteConfigurationEntity>,
  ) {}

  async execute(
    take: number,
    skip: number,
    sort: string,
    order: string,
    search: string,
  ): Promise<PartialResult<RemoteConfigurationEntity>> {
    const query = this.remoteConfigurationRepository
      .createQueryBuilder('remote_configuration')
      // 0 = no limit / no offset, as in TypeORM 0.2 (0.3 sends LIMIT 0 / OFFSET 0)
      .skip(skip || undefined)
      .take(take || undefined);

    if (search && search.length > 0) {
      query.andWhere('remote_configuration.name like :search', {
        search: `%${search}%`,
      });
    }

    applySort(query, sort, order, SORTABLE);

    const [configurations, total] = await query.getManyAndCount();

    return {
      total: total,
      results: configurations,
    };
  }
}
