import { Inject, Injectable } from '@nestjs/common';
import { ReportDomain } from '../domain/report.domain';
import { CreateReportDto } from '../dto/create-report.dto';
import { ICreateReportApplication } from '../interfaces/applications/create.report.application.interface';
import { ICreateReportService } from '../interfaces/services/create.report.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class CreateReportApplication implements ICreateReportApplication {
  constructor(
    @Inject(TYPES.services.ICreateReportService)
    private readonly createReportService: ICreateReportService,
  ) {}

  async execute(createReportDto: CreateReportDto): Promise<ReportDomain> {
    const report = await this.createReportService.execute(createReportDto);
    console.log(report);
    return report;
  }
}
