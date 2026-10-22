import { PaginatedDto } from 'common/dto/paginated.common.dto';
import { ReadRemoteConfigurationDto } from '../../dto';

export interface IListRemoteConfigurationApplication {
  execute(
    take: number,
    skip: number,
    sort: string,
    order: string,
    search: string,
  ): Promise<PaginatedDto<ReadRemoteConfigurationDto>>;
}
