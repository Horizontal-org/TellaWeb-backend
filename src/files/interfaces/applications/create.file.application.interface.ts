import { FileInputStreamDto } from 'src/files/dto/file-input.dto';
import { File } from 'src/files/domain/file.entity';

export interface ICreateFileApplicationInterface {
  execute(input: FileInputStreamDto): Promise<File>;
}
