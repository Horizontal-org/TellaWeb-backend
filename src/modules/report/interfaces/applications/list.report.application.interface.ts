import { PaginatedDto } from 'common/dto/paginated.common.dto';

import { ReadUserDto } from 'modules/user/dto';

import { ReadReportDto } from '../../dto';

export interface IListReportApplication {
  execute(
    take: number,
    skip: number,
    sort: string,
    order: string,
    search: string,
    projectId: string,
    user: ReadUserDto,
  ): Promise<PaginatedDto<ReadReportDto>>;
}
