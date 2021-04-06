import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { ReadReportDto, CreateReportDto } from '../dto';
import {
  TYPES,
  ICreateReportApplication,
  ICreateReportService,
} from '../interfaces';

@Injectable()
export class CreateReportApplication implements ICreateReportApplication {
  constructor(
    @Inject(TYPES.services.ICreateReportService)
    private readonly createReportService: ICreateReportService,
  ) {}

  async execute(createReportDto: CreateReportDto): Promise<ReadReportDto> {
    const report = await this.createReportService.execute(createReportDto);
    return plainToClass(ReadReportDto, report);
  }
}
