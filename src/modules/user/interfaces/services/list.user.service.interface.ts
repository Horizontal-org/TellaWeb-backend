import { UserEntity } from '../../domain';
import { PartialResult } from 'common/dto/partial-result.common.dto';

export interface IListUserService {
  execute(
    take: number,
    skip: number,
    sort: string,
    order: string,
    search: string,
    exclude: Array<string>
  ): Promise<PartialResult<UserEntity>>;
}
