import { FileDto } from '../../dto';

export interface IGetByIdFileApplication {
  execute(id: string): Promise<FileDto>;
}
