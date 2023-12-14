import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { ReadProjectDto } from '../dto';
import { NotFoundProjectException } from '../exceptions';
import {
  TYPES,
  IGetByIdProjectApplication,
  IGetByIdProjectService,
} from '../interfaces';

@Injectable()
export class GetByIdProjectApplication implements IGetByIdProjectApplication {
  constructor(
    @Inject(TYPES.services.IGetByIdProjectService)
    private getByIdProjectService: IGetByIdProjectService,
  ) {}

  async execute(id: string): Promise<ReadProjectDto> {
    const project = await this.getByIdProjectService.execute(id);
    console.log("🚀 ~ file: get-by-id.project.application.ts:21 ~ GetByIdProjectApplication ~ execute ~ project:", project)
    if (!project) throw new NotFoundProjectException(id);

    return plainToClass(ReadProjectDto, project);
  }
}
