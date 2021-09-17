import { PartialResult } from 'common/dto/partial-result.common.dto';

import { RemoteConfigurationEntity } from '../../domain';

export interface IListRemoteConfigurationService {
  execute(
    take: number,
    limit: number,
  ): Promise<PartialResult<RemoteConfigurationEntity>>;
}
