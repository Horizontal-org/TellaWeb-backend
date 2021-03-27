import { FileInputDto } from 'files/dto/file-input.dto';

export interface ICloseFileApplication {
  execute(input: FileInputDto): Promise<void>;
}
