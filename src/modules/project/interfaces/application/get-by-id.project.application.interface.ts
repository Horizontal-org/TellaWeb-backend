import { ReadProjectDto } from '../../dto';

export interface IGetByIdProjectApplication {
  execute(projectId: string): Promise<ReadProjectDto>;
}
