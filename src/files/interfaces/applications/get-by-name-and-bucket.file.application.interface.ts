import { FileInfoDto } from 'files/dto/file-info.dto';
import { GetByNameAndBucketDto } from 'files/dto/get-by-name-and-bucket.dto';

export interface IGetByNameAndBucketFileApplication {
  execute(input: GetByNameAndBucketDto): Promise<FileInfoDto>;
}
