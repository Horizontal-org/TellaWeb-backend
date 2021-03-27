import { FileInfoDto } from 'files/dto/file-info.dto';
import { FileInputDto } from 'files/dto/file-input.dto';

export interface IGetInfoFileService {
  execute(input: FileInputDto): Promise<FileInfoDto>;
}
