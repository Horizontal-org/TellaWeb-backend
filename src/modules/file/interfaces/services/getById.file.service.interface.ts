import { FileDto } from '../../dto';

export interface IGetByIdFileService {
  execute(id: string): Promise<FileDto>;
}
