import { ProjectEntity } from '../../domain';

export interface IGetByIdProjectService {
  execute(projectId: string): Promise<ProjectEntity>;
}
