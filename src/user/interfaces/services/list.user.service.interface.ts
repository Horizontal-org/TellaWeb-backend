import { User } from 'user/domain/user.entity';

export interface IListUserService {
  execute(): Promise<User[]>;
}
