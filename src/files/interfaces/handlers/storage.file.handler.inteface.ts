import { FileInfoDto } from 'src/files/dto/file-info.dto';
import { FileInputDto, FileInputStreamDto } from 'src/files/dto/file-input.dto';

export interface IStorageFileHandler {
  get(input: FileInputDto): Promise<FileInfoDto>;
  append(input: FileInputStreamDto): Promise<boolean>;
}
