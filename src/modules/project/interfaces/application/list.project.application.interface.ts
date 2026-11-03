import { PaginatedDto } from 'common/dto/paginated.common.dto';
import { ReadUserDto } from 'modules/user/dto';

import { ListProjectDto } from '../../dto';

export interface IListProjectApplication {
  execute(
    user: ReadUserDto,
    take: number,
    skip: number,
    sort: string,
    order: string,
    search: string,
  ): Promise<PaginatedDto<ListProjectDto>>;
}
