import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { ReadProjectDto, EditProjectDto } from '../dto';
import {
  TYPES,
  IEditProjectApplication,
  IEditProjectService,
} from '../interfaces';

@Injectable()
export class EditProjectApplication implements IEditProjectApplication {
  constructor(
    @Inject(TYPES.services.IEditProjectService)
    private readonly editProjectService: IEditProjectService,
  ) {}

  async execute(editProjectDto: EditProjectDto): Promise<ReadProjectDto> {
    const project = await this.editProjectService.execute(editProjectDto);
    return plainToClass(ReadProjectDto, project);
  }
}
