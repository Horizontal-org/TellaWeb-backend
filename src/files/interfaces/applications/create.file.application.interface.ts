import { FileInputStreamDto } from 'files/dto/file-input.dto';
import { File } from 'files/domain/file.entity';

export interface ICreateFileApplication {
  execute(input: FileInputStreamDto): Promise<File>;
}
