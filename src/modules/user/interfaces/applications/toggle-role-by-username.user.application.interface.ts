import { ReadUserDto } from '../../dto';

export interface IToggleRoleByUsernameUserApplication {
  execute(username: string): Promise<ReadUserDto | null>;
}
