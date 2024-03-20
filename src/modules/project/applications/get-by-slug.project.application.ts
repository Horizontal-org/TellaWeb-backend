import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { ReadProjectDto } from '../dto';
import { NotFoundProjectException } from '../exceptions';
import {
  TYPES,
  IGetByIdProjectApplication,
  IGetBySlugProjectService,
  IGetBySlugProjectApplication,
} from '../interfaces';

@Injectable()
export class GetBySlugProjectApplication implements IGetBySlugProjectApplication {
  constructor(
    @Inject(TYPES.services.IGetBySlugProjectService)
    private getBySlugProjectService: IGetBySlugProjectService,
  ) {}

  async execute(slug: string): Promise<ReadProjectDto> {
    const project = await this.getBySlugProjectService.execute(slug);
    if (!project) throw new NotFoundProjectException(slug);

    return plainToClass(ReadProjectDto, project);
  }
}
