import { ReadFileDto } from '../../dto';

export interface ICloseFileApplication {
  execute(input: ReadFileDto, reportId: string): Promise<void>;
}
