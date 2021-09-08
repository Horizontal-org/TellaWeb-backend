import { ReadStream } from 'fs';
import { FileType } from 'modules/file/domain';
import { InfoFileDto, ReadFileDto, WriteStreamFileDto } from '../../dto';

export interface IStorageFileHandler {
  get(input: ReadFileDto): Promise<InfoFileDto>;
  getBucket(bucketId: string): Promise<ReadStream[]>;
  append(input: WriteStreamFileDto): Promise<boolean>;
  delete(input: ReadFileDto): Promise<boolean>;
  fetch(input: ReadFileDto): Promise<ReadStream>;
  close(input: ReadFileDto): Promise<boolean>;
  getType(input: ReadFileDto): Promise<FileType>;
}
