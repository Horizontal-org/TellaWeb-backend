import { FileDto } from '../../dto';

export interface IGetByIdFileApplication {
  execute(id: string, bucket: string): Promise<FileDto>;
}
