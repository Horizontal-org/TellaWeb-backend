import { ReadFileDto } from '../../dto';

export interface IDeleteFileApplication {
  execute(readFileDto: ReadFileDto): Promise<boolean>;
}
