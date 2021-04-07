import { FileDto, ReadFileDto } from '../../dto';

export interface IGetOrCreateFileService {
  execute(input: ReadFileDto): Promise<FileDto>;
}
