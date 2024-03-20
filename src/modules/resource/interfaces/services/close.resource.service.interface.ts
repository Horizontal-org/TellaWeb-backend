import { CloseResourceDto } from '../../dto';

export interface ICloseResourceService {
  execute(input: CloseResourceDto): Promise<void>;
}
