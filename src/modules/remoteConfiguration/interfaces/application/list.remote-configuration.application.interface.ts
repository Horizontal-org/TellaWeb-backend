import { PaginatedDto } from 'common/dto/paginated.common.dto';
import { ReadRemoteConfigurationDto } from '../../dto';

export interface IListRemoteConfigurationApplication {
  execute(
    take: number,
    skip: number,
  ): Promise<PaginatedDto<ReadRemoteConfigurationDto>>;
}
