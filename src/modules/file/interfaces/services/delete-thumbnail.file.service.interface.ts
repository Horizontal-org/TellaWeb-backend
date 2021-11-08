import { ReadFileDto } from '../../dto';

export interface IDeleteThumbnailFileService {
  execute(readFileDto: ReadFileDto): Promise<boolean>;
}
