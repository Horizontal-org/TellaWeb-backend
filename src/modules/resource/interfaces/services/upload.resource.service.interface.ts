import { WriteStreamResourceDto, ReadResourceDto } from '../../dto';

export interface IUploadResourceService {
  execute(input: WriteStreamResourceDto): Promise<ReadResourceDto>;
}
