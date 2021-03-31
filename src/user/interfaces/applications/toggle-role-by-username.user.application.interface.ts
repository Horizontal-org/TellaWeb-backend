import { User } from 'user/domain/user.entity';

export interface IToggleRoleByUsernameUserApplication {
  execute(username: string): Promise<User | null>;
}
