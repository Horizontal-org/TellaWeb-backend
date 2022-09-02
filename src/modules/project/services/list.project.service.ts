import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PartialResult } from 'common/dto/partial-result.common.dto';

import { ProjectEntity } from '../domain';
import { IListProjectService } from '../interfaces';

@Injectable()
export class ListProjectService implements IListProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
  ) {}

  async execute(
    take: number,
    skip: number,
    sort: string,
    order: string,
    search: string,
  ): Promise<PartialResult<ProjectEntity>> {
    const query = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.reports', 'reports')
      .leftJoinAndSelect('project.users', 'users')
      .skip(skip)
      .take(take);

    if (search && search.length > 0) {
      query.where(
        'project.name like :search',
        {
          search: `%${search}%`,
        },
      );
    }

    if (sort && sort.length > 0) {
      query.orderBy(sort, order === 'asc' ? 'ASC' : 'DESC');
    }

    const [projects, total] = await query.getManyAndCount();
    return {
      total: total,
      results: projects,
    };
  }
}
