import { Inject, Injectable } from '@nestjs/common';
import { getConnection, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../domain';
import { IBatchDeleteUsersService } from '../interfaces/services/batch-delete.user.service.interface';
import { TYPES } from '../interfaces';
import { IBatchDeleteUsersApplication } from '../interfaces/applications/batch-delete.user.application.interface';

@Injectable()
export class BatchDeleteUsersService implements IBatchDeleteUsersService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    @Inject(TYPES.applications.IBatchDeleteUsersApplication)
    private batchDeleteUsersApplication: IBatchDeleteUsersApplication,
  ) {}

  async execute(toDelete: Array<string>): Promise<boolean> {
    await getConnection()
      .createQueryBuilder()
      .delete()
      .from(UserEntity)
      .where('report.id IN (:...toDelete)', { toDelete: toDelete })
      .execute();

    await toDelete.forEach(async (id) => {
      await this.batchDeleteUsersApplication.execute(id);
    });
    return true;
  }
}
