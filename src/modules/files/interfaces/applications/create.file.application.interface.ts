import { FileDto, WriteStreamFileDto } from '../../dto';

export interface ICreateFileApplication {
  execute(input: WriteStreamFileDto): Promise<FileDto>;
}
