import { File } from 'files/domain/file.entity';
import { FileInputDto } from '../../dto/file-input.dto';

export interface IGetOrCreateFileService {
  execute(input: FileInputDto): Promise<File>;
}
