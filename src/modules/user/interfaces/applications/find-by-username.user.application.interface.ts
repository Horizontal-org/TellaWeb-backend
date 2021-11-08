import { ReadUserDto } from '../../dto';

export interface IFindByUsernameUserApplication {
  execute(username: string): Promise<ReadUserDto>;
}
