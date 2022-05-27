import { Injectable } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../domain';
import { IBatchDeleteUsersService } from '../interfaces/services/batch-delete.user.service.interface';

@Injectable()
export class BatchDeleteUsersService implements IBatchDeleteUsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async execute(toDelete: Array<string>): Promise<boolean> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(UserEntity)
      .where('username IN (:...toDelete)', { toDelete: toDelete }) //delete users by username
      .execute();
    return true;
  }
}
