import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IGetByIdReportService } from 'modules/report/interfaces/services/get-by-id.report.service.interface';
import { ReportEntity } from 'modules/report/domain/report.entity';

@Injectable()
export class GetByIdReportService implements IGetByIdReportService {
  constructor(
    @InjectRepository(ReportEntity)
    private reportRepository: Repository<ReportEntity>,
  ) {}

  async execute(reportId: string): Promise<ReportEntity> {
    return this.reportRepository.findOne(reportId);
  }
}
