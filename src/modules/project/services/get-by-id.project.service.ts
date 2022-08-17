import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ProjectEntity } from '../domain';
import { IGetByIdProjectService } from '../interfaces/service/get-by-id.project.service.interface';

@Injectable()
export class GetByIdProjectService implements IGetByIdProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
  ) {}

  async execute(projectId: string): Promise<ProjectEntity> {
    return this.projectRepository.findOne(projectId, { relations: ['users']});
  }
}
