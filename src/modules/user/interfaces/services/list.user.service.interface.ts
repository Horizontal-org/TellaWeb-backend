import { UserEntity } from '../../domain';

export interface IListUserService {
  execute(): Promise<UserEntity[]>;
}
