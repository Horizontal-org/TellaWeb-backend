import {
  CreateProjectDto,
  ReadProjectDto,
} from '../../dto';

export interface ICreateProjectApplication {
  execute(
    createProjectDto: CreateProjectDto,
  ): Promise<ReadProjectDto>;
}
