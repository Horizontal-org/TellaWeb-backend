import { FileDto } from 'src/files/dto/file.dto';

export interface IGetByIdFileService {
  execute(id: string): Promise<FileDto>;
}
