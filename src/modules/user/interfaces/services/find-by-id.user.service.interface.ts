import { UserEntity } from '../../domain';

export interface IFindByIdUserService {
  execute(userId: string): Promise<UserEntity>;
}
