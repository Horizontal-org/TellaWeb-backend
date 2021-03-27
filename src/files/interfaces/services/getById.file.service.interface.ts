import { FileDto } from 'files/dto/file.dto';

export interface IGetByIdFileService {
  execute(id: string): Promise<FileDto>;
}
