import { User } from 'user/domain/user.entity';

export interface IListUserApplication {
  execute(): Promise<User[]>;
}
