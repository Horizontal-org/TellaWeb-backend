import { Inject, Injectable } from '@nestjs/common';
import { array } from 'yargs';

import { NotFoundUserException } from '../exceptions';
import { TYPES } from '../interfaces';
import { IBatchDeleteUsersApplication } from '../interfaces/applications/batch-delete.user.application.interface';
import { IBatchDeleteUsersService } from '../interfaces/services/batch-delete.user.service.interface';

@Injectable()
export class BatchDeleteUsersApplication
  implements IBatchDeleteUsersApplication {
  constructor(
    @Inject(TYPES.services.IBatchDeleteUsersService)
    private batchDeleteReportService: IBatchDeleteUsersService,
  ) {}

  async execute(toDelete: Array<string>): Promise<boolean> {
    const deleted = await this.batchDeleteReportService.execute(toDelete);
    return deleted;
  }
}
