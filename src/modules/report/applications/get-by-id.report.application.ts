import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { ReadReportDto } from '../dto';
import { NotFoundReportException } from '../exceptions';
import {
  TYPES,
  IGetByIdReportApplication,
  IGetByIdReportService,
} from '../interfaces';

@Injectable()
export class GetByIdReportApplication implements IGetByIdReportApplication {
  constructor(
    @Inject(TYPES.services.IGetByIdReportService)
    private getByIdReportService: IGetByIdReportService,
  ) {}

  async execute(id: string): Promise<ReadReportDto> {
    const report = await this.getByIdReportService.execute(id);
    if (!report) throw new NotFoundReportException(id);

    return plainToClass(ReadReportDto, report);
  }
}
