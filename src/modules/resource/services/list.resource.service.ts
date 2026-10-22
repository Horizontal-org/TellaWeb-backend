import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PartialResult } from 'common/dto/partial-result.common.dto';
import { applySort, SortableColumns } from 'common/utils/sort.utils';

import { ResourceEntity } from '../domain';
import { IListResourceService } from '../interfaces';
import { PaginatedDto } from 'common/dto/paginated.common.dto';
import { ReadResourceDto } from '../dto';
import { plainToClass } from 'class-transformer';

const SORTABLE: SortableColumns = {
  'resource.title': 'resource.title',
  'resource.fileName': 'resource.fileName',
  'resource.createdAt': 'resource.createdAt',
};

@Injectable()
export class ListResourceService implements IListResourceService {
  constructor(
    @InjectRepository(ResourceEntity)
    private readonly resourceRepository: Repository<ResourceEntity>,
  ) {}

  async execute(
    take: number,
    skip: number,
    sort: string,
    order: string,
    search: string,
    exclude: Array<string>,
    projectId?: string,
  ): Promise<PaginatedDto<ReadResourceDto>> {
    const query = this.resourceRepository
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.projects', 'project')
      // 0 = no limit / no offset, as in TypeORM 0.2 (0.3 sends LIMIT 0 / OFFSET 0)
      .skip(skip || undefined)
      .take(take || undefined);

    // Optional: only the resources of one project (the project page's list). A subquery on the
    // join table, so the joined `projects` of each resource stay complete
    if (projectId && projectId.length > 0) {
      query.andWhere(
        'resource.id IN (SELECT pr.resource_id FROM projects_resources pr WHERE pr.project_id = :projectId)',
        { projectId },
      );
    }

    if (search && search.length > 0) {
      query.andWhere('resource.title like :search', {
        search: `%${search}%`,
      });
    }

    if (exclude && exclude.length > 0) {
      query.andWhere('resource.id NOT IN (:...exclude)', { exclude: exclude });
    }

    applySort(query, sort, order, SORTABLE);

    const [resources, total] = await query.getManyAndCount();

    return {
      limit: take,
      offset: skip,
      total: total,
      results: resources.map((report) => plainToClass(ReadResourceDto, report)),
    };
  }
}
