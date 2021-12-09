import { Inject, Injectable } from '@nestjs/common';

import { NotFoundReportException } from '../exceptions';
import {
  TYPES,
  IBatchDeleteReportApplication,
  IBatchDeleteReportService,
} from '../interfaces';

@Injectable()
export class BatchDeleteReportApplication
  implements IBatchDeleteReportApplication {
  constructor(
    @Inject(TYPES.services.IBatchDeleteReportService)
    private batchDeleteReportService: IBatchDeleteReportService,
  ) {}

  async execute(toDelete: Array<string>): Promise<boolean> {
    const deleted = await this.batchDeleteReportService.execute(toDelete);
    return deleted;
  }
}
