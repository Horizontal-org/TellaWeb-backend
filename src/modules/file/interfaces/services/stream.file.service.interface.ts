import { StreamFileDto } from 'modules/file/dto/stream.file.dto';
import { ReadFileDto } from '../../dto';

export interface IStreamFileService {
  execute(readFileDto: ReadFileDto, range: string): Promise<StreamFileDto>;
}
