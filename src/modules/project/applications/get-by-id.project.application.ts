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
    if (!project) throw new NotFoundProjectException(id);

    return plainToClass(ReadProjectDto, project);
  }
}
