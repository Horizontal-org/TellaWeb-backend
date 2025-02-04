import { ReadUserDto } from "modules/user/dto";

export interface IStartBackupApplication {
    execute(user: ReadUserDto): Promise<void>;
  }
  