import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { UserEntity } from '../domain';
import { IListUserService } from '../interfaces';
import { PartialResult } from 'common/dto/partial-result.common.dto';

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
    exclude: Array<string>
  ): Promise<PartialResult<UserEntity>> {
    const query = this.userRepository
      .createQueryBuilder('user')
      .skip(skip)
      .take(take)
      .where({ deletedAt: null })

    if (search && search.length > 0) {
      query.andWhere('user.username like :search', { search: `%${search}%` });
    }
    
    if (exclude && exclude.length > 0) {
      query.andWhere('user.id NOT IN (:...exclude)', { exclude: exclude })
    }

    if (sort && sort.length > 0) {
      query.orderBy(sort, order === 'asc' ? 'ASC' : 'DESC');
    }

    const [users, total] = await query.getManyAndCount();
    return {
      total: total,
      results: users,
    };
  }
}
