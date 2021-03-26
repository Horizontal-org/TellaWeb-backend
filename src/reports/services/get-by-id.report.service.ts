import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IGetByIdReportService } from 'src/reports/interfaces/services/get-by-id.report.service.interface';
import { ReportDomain } from 'src/reports/domain/report.domain';
import { Report } from '../domain/report.entity';

@Injectable()
export class GetByIdReportService implements IGetByIdReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  async execute(reportId: string): Promise<ReportDomain> {
    return this.reportRepository.findOne(reportId);
  }
}
