import { FileDto } from 'files/dto/file.dto';

export interface IGetByIdFileApplication {
  execute(id: string): Promise<FileDto>;
}
