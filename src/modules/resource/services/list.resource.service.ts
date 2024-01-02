import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PartialResult } from 'common/dto/partial-result.common.dto';

import { ResourceEntity } from '../domain';
import { IListResourceService } from '../interfaces';
import { PaginatedDto } from 'common/dto/paginated.common.dto';
import { ReadResourceDto } from '../dto';
import { plainToClass } from 'class-transformer';

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
    exclude: Array<string>
  ): Promise<PaginatedDto<ReadResourceDto>> {

    const query = this.resourceRepository
      .createQueryBuilder('resource')
      .leftJoinAndSelect('resource.projects', 'project')
      .skip(skip)
      .take(take);

    if (search && search.length > 0) {
      query.where(
        'resource.title like :search',
        {
          search: `%${search}%`,
        },
      );
    }

        
    if (exclude && exclude.length > 0) {
      query.andWhere('resource.id NOT IN (:...exclude)', { exclude: exclude })
    }


    if (sort && sort.length > 0) {
      query.orderBy(sort, order === 'asc' ? 'ASC' : 'DESC');
    }

    const [resources, total] = await query.getManyAndCount();

    return {
      limit: take,
      offset: skip,
      total: total,
      results: resources.map((report) => plainToClass(ReadResourceDto, report)),
    };
  }
}
