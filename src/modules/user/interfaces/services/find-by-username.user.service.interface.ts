import { UserEntity } from '../../domain';

export interface IFindByUsernameUserService {
  execute(username: string): Promise<UserEntity>;
}
