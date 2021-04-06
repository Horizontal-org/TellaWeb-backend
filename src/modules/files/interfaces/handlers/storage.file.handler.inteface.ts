import { InfoFileDto, ReadFileDto, WriteStreamFileDto } from '../../dto';

export interface IStorageFileHandler {
  get(input: ReadFileDto): Promise<InfoFileDto>;
  append(input: WriteStreamFileDto): Promise<boolean>;
}
