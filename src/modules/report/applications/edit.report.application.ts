import { Inject, Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { ReadReportDto, EditReportDto } from '../dto';
import {
  TYPES,
  IEditReportApplication,
  IEditReportService,
} from '../interfaces';

@Injectable()
export class EditReportApplication implements IEditReportApplication {
  constructor(
    @Inject(TYPES.services.IEditReportService)
    private readonly editReportService: IEditReportService,
  ) {}

  async execute(editReportDto: EditReportDto): Promise<ReadReportDto> {
    const report = await this.editReportService.execute(editReportDto);
    return plainToClass(ReadReportDto, report);
  }
}
