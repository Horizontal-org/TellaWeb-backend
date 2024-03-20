import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { ProjectEntity } from '../domain';
import { IGetBySlugProjectService } from '../interfaces/service/get-by-slug.project.service.interface';

@Injectable()
export class GetBySlugProjectService implements IGetBySlugProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectRepository: Repository<ProjectEntity>,
  ) {}

  async execute(projectSlug: string): Promise<ProjectEntity> {
    return this.projectRepository.findOne({
      relations: ['users'],
      where: { slug: projectSlug }
    });
  }
}
