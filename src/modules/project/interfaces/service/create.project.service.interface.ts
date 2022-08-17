import { ProjectEntity } from '../../domain';
import { CreateProjectDto } from '../../dto';

export interface ICreateProjectService {
  execute(
    createProjectDto: CreateProjectDto,
  ): Promise<ProjectEntity>;
}
