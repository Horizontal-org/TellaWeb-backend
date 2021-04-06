import { InfoFileDto, ReadFileDto } from '../../dto';

export interface IGetByNameAndBucketFileApplication {
  execute(input: ReadFileDto): Promise<InfoFileDto>;
}
