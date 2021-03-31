import { User } from 'user/domain/user.entity';

export interface IFindByUsernameUserService {
  execute(username: string): Promise<User>;
}
