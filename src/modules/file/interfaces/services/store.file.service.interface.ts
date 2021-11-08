import { WriteStreamFileDto, FileDto } from '../../dto';

export interface IStoreFileService {
  execute(input: WriteStreamFileDto): Promise<FileDto>;
}
