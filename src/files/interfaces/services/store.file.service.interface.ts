import { FileDto } from 'src/files/dto/file.dto';
import { FileInputStreamDto } from '../../dto/file-input.dto';

export interface IStoreFileService {
  execute(input: FileInputStreamDto): Promise<FileDto>;
}
