import { FileInputDto } from 'src/files/dto/file-input.dto';

export interface ICloseFileService {
  execute(input: FileInputDto): Promise<void>;
}
