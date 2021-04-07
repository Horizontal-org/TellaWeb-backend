import { InfoFileDto, ReadFileDto } from '../../dto';

export interface IGetInfoFileService {
  execute(input: ReadFileDto): Promise<InfoFileDto>;
}
