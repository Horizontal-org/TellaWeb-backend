import { ReadUserDto } from '../../dto';
import { PaginatedDto } from 'common/dto/paginated.common.dto';

export interface IListUserApplication {
  execute(
    take: number,
    skip: number,
    sort: string,
    order: string,
    search: string,
  ): Promise<PaginatedDto<ReadUserDto>>;
}
