import { PartialResult } from 'common/dto/partial-result.common.dto';
import { ReadUserDto } from 'modules/user/dto';

import { ProjectEntity } from '../../domain';

export interface IListProjectService {
  execute(
    user: ReadUserDto,
    take: number,
    limit: number,
    sort: string,
    order: string,
    search: string,
  ): Promise<PartialResult<ProjectEntity>>;
}
