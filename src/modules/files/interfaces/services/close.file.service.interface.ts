import { CloseFileDto } from '../../dto';

export interface ICloseFileService {
  execute(input: CloseFileDto): Promise<void>;
}
