import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../domain';
import { IListUserService } from '../interfaces';
import { PartialResult } from 'common/dto/partial-result.common.dto';
import { applySort, SortableColumns } from 'common/utils/sort.utils';

const SORTABLE: SortableColumns = {
  'user.username': 'user.username',
  'user.role': 'user.role',
  'user.createdAt': 'user.createdAt',
};

@Injectable()
export class ListUserService implements IListUserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(
    take: number,
    skip: number,
    sort: string,
    order: string,
    search: string,
    exclude: Array<string>,
  ): Promise<PartialResult<UserEntity>> {
    const query = this.userRepository
      .createQueryBuilder('user')
      // 0 = no limit / no offset, as in TypeORM 0.2 (0.3 sends LIMIT 0 / OFFSET 0)
      .skip(skip || undefined)
      .take(take || undefined);

    if (search && search.length > 0) {
      query.andWhere('user.username like :search', { search: `%${search}%` });
    }

    if (exclude && exclude.length > 0) {
      query.andWhere('user.id NOT IN (:...exclude)', { exclude: exclude });
    }

    applySort(query, sort, order, SORTABLE);

    const [users, total] = await query.getManyAndCount();
    return {
      total: total,
      results: users,
    };
  }
}
