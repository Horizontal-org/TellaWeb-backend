import { ReadFileDto } from '../../dto';

export interface IDeleteFullFileService {
  execute(readFileDto: ReadFileDto): Promise<boolean>;
}
