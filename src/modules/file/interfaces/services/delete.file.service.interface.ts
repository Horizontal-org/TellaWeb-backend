import { ReadFileDto } from '../../dto';

export interface IDeleteFileService {
  execute(readFileDto: ReadFileDto): Promise<boolean>;
}
