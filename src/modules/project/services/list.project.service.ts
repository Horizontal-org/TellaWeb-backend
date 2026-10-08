import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PartialResult } from 'common/dto/partial-result.common.dto';
import { applySort, SortableColumns } from 'common/utils/sort.utils';

import { ProjectEntity } from '../domain';
import { IListProjectService } from '../interfaces';
import { ReadUserDto } from 'modules/user/dto';

// the web app sends project.created_at (the column name), which TypeORM can't
// sort by when paginating with joins; it's mapped to the property
const SORTABLE: SortableColumns = {
  'project.created_at': 'project.createdAt',
  'project.createdAt': 'project.createdAt',
  'project.name': 'project.name',
};

@Injectable()
export class ListProjectService implements IListProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
  ) {}

  async execute(
    user: ReadUserDto,
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
      // 0 = no limit / no offset, as in TypeORM 0.2 (0.3 sends LIMIT 0 / OFFSET 0)
      .skip(skip || undefined)
      .take(take || undefined);

    if (user.role !== 'admin') {
      query.where('users.id = :userId', { userId: user.id });
    }

    if (search && search.length > 0) {
      query.andWhere('project.name like :search', {
        search: `%${search}%`,
      });
    }

    applySort(query, sort, order, SORTABLE);

    const [projects, total] = await query.getManyAndCount();
    return {
      total: total,
      results: projects,
    };
  }
}
