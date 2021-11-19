import { ReadStream } from 'fs';
import { FileType } from 'modules/file/domain';
import { StreamFileDto } from 'modules/file/dto/stream.file.dto';
import { InfoFileDto, ReadFileDto, WriteStreamFileDto } from '../../dto';

export interface IStorageFileHandler {
  get(input: ReadFileDto): Promise<InfoFileDto>;
  getBucket(bucketId: string): Promise<ReadStream[]>;
  deleteBucket(bucketId: string): Promise<boolean>;
  append(input: WriteStreamFileDto): Promise<boolean>;
  delete(input: ReadFileDto): Promise<boolean>;
  fetch(input: ReadFileDto): Promise<ReadStream>;
  stream(input: ReadFileDto, range: string): Promise<StreamFileDto>;
  close(input: ReadFileDto): Promise<boolean>;
  getType(input: ReadFileDto): Promise<FileType>;
  fileSize(input: ReadFileDto, isPartial: boolean): Promise<number>;
  getPath(input: ReadFileDto, isPartial: boolean): string;
}
