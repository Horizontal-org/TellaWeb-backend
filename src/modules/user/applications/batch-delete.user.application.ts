import { Inject, Injectable } from '@nestjs/common';
import {
  TYPES,
  IBatchDeleteUsersApplication,
  IBatchDeleteUsersService
 } from '../interfaces';

@Injectable()
export class BatchDeleteUsersApplication
  implements IBatchDeleteUsersApplication {
  constructor(
    @Inject(TYPES.services.IBatchDeleteUsersService)
    private batchDeleteUsersService: IBatchDeleteUsersService,
  ) {}

  async execute(toDelete: Array<string>): Promise<boolean> {
    const deleted = await this.batchDeleteUsersService.execute(toDelete);
    return deleted;
  }
}
