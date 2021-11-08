import { ReadUserDto } from '../../dto';

export interface IGetByIdUserApplication {
  execute(userId: string): Promise<ReadUserDto>;
}
