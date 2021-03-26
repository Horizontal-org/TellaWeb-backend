import { File } from 'src/files/domain/file.entity';
import { FileInputDto } from '../../dto/file-input.dto';

export interface IGetOrCreateFileService {
  execute(input: FileInputDto): Promise<File>;
}
