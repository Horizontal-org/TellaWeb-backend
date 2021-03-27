import { FileInputStreamDto } from 'files/dto/file-input.dto';
import { File } from 'files/domain/file.entity';

export interface ICreateFileApplicationInterface {
  execute(input: FileInputStreamDto): Promise<File>;
}
