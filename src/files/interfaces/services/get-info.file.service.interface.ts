import { FileInfoDto } from 'src/files/dto/file-info.dto';
import { FileInputDto } from 'src/files/dto/file-input.dto';

export interface IGetInfoFileService {
  execute(input: FileInputDto): Promise<FileInfoDto>;
}
