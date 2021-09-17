import { PaginatedDto } from 'common/dto/paginated.common.dto';
import { RemoteConfigurationReadDto } from '../../dto';

export interface IListRemoteConfigurationApplication {
  execute(
    take: number,
    skip: number,
  ): Promise<PaginatedDto<RemoteConfigurationReadDto>>;
}
