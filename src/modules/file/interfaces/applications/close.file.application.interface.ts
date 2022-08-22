import { CloseFileDto, ReadFileDto } from '../../dto';

export interface ICloseFileApplication {
  execute(input: CloseFileDto, reportId: string): Promise<void>;
}
