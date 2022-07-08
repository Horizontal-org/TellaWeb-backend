import { PartialResult } from 'common/dto/partial-result.common.dto';

import { ProjectEntity } from '../../domain';

export interface IListProjectService {
  execute(
    take: number,
    limit: number,
    sort: string,
    order: string,
    search: string,
  ): Promise<PartialResult<ProjectEntity>>;
}
