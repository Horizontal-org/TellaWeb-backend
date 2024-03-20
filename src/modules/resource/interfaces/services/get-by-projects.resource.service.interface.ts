import { ByProjectResourceDto, ReadResourceDto } from 'modules/resource/dto';

export interface IGetByProjectsResourceService {
  execute(ids: string[], userId: string, role: string): Promise<ByProjectResourceDto[]>;  
}
