import { ReadStream } from 'fs';
import { FileType } from 'modules/file/domain';
import { StreamFileDto } from 'modules/file/dto/stream.file.dto';
import { ReadUserDto } from 'modules/user/dto';
// import { InfoFileDto, ReadFileDto, WriteStreamFileDto } from '../../dto';

export interface IProcessBackupHandler {
  process(user: ReadUserDto): Promise<void>;
}
