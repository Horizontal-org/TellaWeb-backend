import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

import { RolesUser } from 'modules/user/domain';
import { ReadUserDto } from 'modules/user/dto';

import { NotFoundReportException } from '../exceptions';
import { countAccessibleReports } from '../guard/access.report.guard';
import {
  TYPES,
  IBatchDeleteReportApplication,
  IBatchDeleteReportService,
} from '../interfaces';

@Injectable()
export class BatchDeleteReportApplication implements IBatchDeleteReportApplication {
  constructor(
    private readonly dataSource: DataSource,
    @Inject(TYPES.services.IBatchDeleteReportService)
    private batchDeleteReportService: IBatchDeleteReportService,
  ) {}

  async execute(toDelete: Array<string>, user: ReadUserDto): Promise<boolean> {
    if (user.role !== RolesUser.ADMIN) {
      // all or nothing: one report outside the user's projects blocks the batch
      const ids = [...new Set(toDelete)];
      const accessible = await countAccessibleReports(
        this.dataSource,
        user.id,
        ids,
      );
      if (accessible !== ids.length) throw new ForbiddenException();
    }

    const deleted = await this.batchDeleteReportService.execute(toDelete);
    return deleted;
  }
}
