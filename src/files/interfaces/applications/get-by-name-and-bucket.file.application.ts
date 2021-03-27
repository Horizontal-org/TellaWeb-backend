import { FileInfoDto } from 'files/dto/file-info.dto';
import { FileInputDto } from 'files/dto/file-input.dto';

export interface IGetByNameAndBucketFileApplication {
  execute(input: FileInputDto): Promise<FileInfoDto>;
}
