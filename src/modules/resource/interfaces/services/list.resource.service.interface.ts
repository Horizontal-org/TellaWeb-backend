import { PartialResult } from 'common/dto/partial-result.common.dto';

import { ResourceEntity } from '../../domain';
import { ReadResourceDto } from 'modules/resource/dto';
import { PaginatedDto } from 'common/dto/paginated.common.dto';

export interface IListResourceService {
  execute(
    take: number,
    limit: number,
    sort: string,
    order: string,
    search: string,
    exclude: Array<string>
  ): Promise<PaginatedDto<ReadResourceDto>>;
}
