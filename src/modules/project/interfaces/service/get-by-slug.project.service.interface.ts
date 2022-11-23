import { ProjectEntity } from '../../domain';

export interface IGetBySlugProjectService {
  execute(projectSlug: string): Promise<ProjectEntity>;
}
