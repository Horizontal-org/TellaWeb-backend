import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import {
  ReadProjectDto,
  CreateProjectDto,
} from '../dto';
import {
  TYPES,
  ICreateProjectApplication,
  ICreateProjectService,
} from '../interfaces';

import {
  IMakePublicUserApplication,
  TYPES as TYPES_USER,
} from '../../user/interfaces';

@Injectable()
export class CreateProjectApplication
  implements ICreateProjectApplication {
  constructor(
    @Inject(TYPES.services.ICreateProjectService)
    private readonly createProjectService: ICreateProjectService,
  ) {}

  async execute(
    createProjectDto: CreateProjectDto,
  ): Promise<ReadProjectDto> {

    const project = await this.createProjectService.execute(
      createProjectDto,
    );
    return plainToClass(ReadProjectDto, project);
  }
}
