import { FileInputDto } from 'files/dto/file-input.dto';

export interface ICloseFileService {
  execute(input: FileInputDto): Promise<void>;
}
