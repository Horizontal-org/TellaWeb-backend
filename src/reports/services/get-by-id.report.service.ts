import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IGetByIdReportService } from 'reports/interfaces/services/get-by-id.report.service.interface';
import { Report } from 'reports/domain/report.entity';

@Injectable()
export class GetByIdReportService implements IGetByIdReportService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
  ) {}

  async execute(reportId: string): Promise<Report> {
    return this.reportRepository.findOne(reportId);
  }
}
