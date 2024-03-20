import { ReadProjectDto } from '../../dto';

export interface IGetBySlugProjectApplication {
  execute(projectSlug: string): Promise<ReadProjectDto>;
}
