import { ReadUserDto } from 'modules/user/dto';

export interface IBatchDeleteReportApplication {
  execute(toDelete: Array<string>, user: ReadUserDto): Promise<boolean>;
}
