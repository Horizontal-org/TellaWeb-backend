import { PaginatedDto } from 'common/dto/paginated.common.dto';

import { ReadReportDto } from '../../dto';

export interface IListReportApplication {
  execute(
    take: number,
    skip: number,
    sort: string,
    order: string,
    search: string,
  ): Promise<PaginatedDto<ReadReportDto>>;
}
