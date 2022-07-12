import { EditProjectDto, ReadProjectDto } from '../../dto';

export interface IEditProjectApplication {
  execute(editProjectDto: EditProjectDto): Promise<ReadProjectDto>;
}
