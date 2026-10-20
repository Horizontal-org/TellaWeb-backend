import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../domain';
import { IBatchDeleteUsersService } from '../interfaces/services/batch-delete.user.service.interface';

@Injectable()
export class BatchDeleteUsersService implements IBatchDeleteUsersService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async execute(toDelete: Array<string>): Promise<boolean> {
    await this.dataSource
      .createQueryBuilder()
      .delete()
      .from(UserEntity)
      .where('id IN (:...toDelete)', { toDelete: toDelete }) //delete users by username
      .execute();

    return true;
  }
}
