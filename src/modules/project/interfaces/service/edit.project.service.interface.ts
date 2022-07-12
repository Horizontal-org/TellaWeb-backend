import { ProjectEntity } from '../../domain';
import { EditProjectDto } from '../../dto';

export interface IEditProjectService {
  execute(editProjectDto: EditProjectDto): Promise<ProjectEntity>;
}
