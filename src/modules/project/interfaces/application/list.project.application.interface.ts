import { PaginatedDto } from 'common/dto/paginated.common.dto';

import { ReadProjectDto } from '../../dto';

export interface IListProjectApplication {
  execute(
    take: number,
    skip: number,
    sort: string,
    order: string,
    search: string,
  ): Promise<PaginatedDto<ReadProjectDto>>;
}
