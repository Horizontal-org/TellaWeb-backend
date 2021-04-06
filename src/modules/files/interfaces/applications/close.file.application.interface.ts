import { ReadFileDto } from '../../dto';

export interface ICloseFileApplication {
  execute(input: ReadFileDto): Promise<void>;
}
