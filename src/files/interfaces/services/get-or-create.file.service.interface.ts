import { FileDto } from 'files/dto/file.dto';
import { FileInputDto } from '../../dto/file-input.dto';

export interface IGetOrCreateFileService {
  execute(input: FileInputDto): Promise<FileDto>;
}
