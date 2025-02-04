import { ReadUserDto } from "modules/user/dto";

export interface IStartBackupService {
    execute(user: ReadUserDto): Promise<void>;
  }
  