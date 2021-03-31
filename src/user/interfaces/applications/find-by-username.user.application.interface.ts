import { User } from 'user/domain/user.entity';

export interface IFindByUsernameUserApplication {
  execute(username: string): Promise<User>;
}
