import { CloseFileDto } from '../../dto';

export interface ICloseFileService {
  execute(input: CloseFileDto, reportId: string): Promise<void>;
}
