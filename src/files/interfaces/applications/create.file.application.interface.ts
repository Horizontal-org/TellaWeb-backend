import { FileInputStreamDto } from 'files/dto/file-input.dto';
import { FileDto } from 'files/dto/file.dto';

export interface ICreateFileApplication {
  execute(input: FileInputStreamDto): Promise<FileDto>;
}
