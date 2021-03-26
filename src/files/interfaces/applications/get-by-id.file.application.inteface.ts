import { FileDto } from 'src/files/dto/file.dto';

export interface IGetByIdFileApplication {
  execute(id: string): Promise<FileDto>;
}
