import { Inject, Injectable } from '@nestjs/common';

import { NotFoundReportException } from '../exceptions';
import {
  TYPES,
  IDeleteByIdReportService,
  IDeletedByIdReportApplication,
} from '../interfaces';

@Injectable()
export class DeleteByIdReportApplication
  implements IDeletedByIdReportApplication {
  constructor(
    @Inject(TYPES.services.IDeleteByIdReportService)
    private deleteByIdReportService: IDeleteByIdReportService,
  ) {}

  async execute(reportId: string): Promise<boolean> {
    const deleted = await this.deleteByIdReportService.execute(reportId);
    if (!deleted) throw new NotFoundReportException(reportId);
    return deleted;
  }
}
