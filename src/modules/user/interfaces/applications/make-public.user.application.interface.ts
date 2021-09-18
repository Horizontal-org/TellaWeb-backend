import { ReadUserDto } from '../../dto';

export interface IMakePublicUserApplication {
  execute(username: string): Promise<ReadUserDto>;
}
