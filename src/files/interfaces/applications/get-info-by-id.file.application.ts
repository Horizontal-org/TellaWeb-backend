import { FileInfoDto } from 'src/files/dto/file-info.dto';

export interface IGetInfoByIdFileApplication {
  execute(id: string): Promise<FileInfoDto>;
}
