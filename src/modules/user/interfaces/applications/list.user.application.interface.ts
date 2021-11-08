import { ReadUserDto } from '../../dto';

export interface IListUserApplication {
  execute(): Promise<ReadUserDto[]>;
}
