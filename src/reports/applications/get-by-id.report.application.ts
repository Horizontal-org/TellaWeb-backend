import { Inject, Injectable } from '@nestjs/common';
import { Report } from 'reports/domain/report.entity';
import { ReportNotFound } from '../exceptions/report-not-found';
import { IGetByIdReportApplication } from '../interfaces/applications/get-by-id.report.application.interface';
import { IGetByIdReportService } from '../interfaces/services/get-by-id.report.service.interface';
import { TYPES } from '../interfaces/types';

@Injectable()
export class GetByIdReportApplication implements IGetByIdReportApplication {
  constructor(
    @Inject(TYPES.services.IGetByIdReportService)
    private reportService: IGetByIdReportService,
  ) {}

  async execute(id: string): Promise<Report> {
    const report = await this.reportService.execute(id);
    if (!report) throw new ReportNotFound(id);

    return report;
  }
}
