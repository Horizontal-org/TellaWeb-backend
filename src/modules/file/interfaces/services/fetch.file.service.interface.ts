import { ReadStream } from 'fs';
import { ReadFileDto } from '../../dto';

export interface IFetchFileService {
  execute(readFileDto: ReadFileDto): Promise<ReadStream>;
}
