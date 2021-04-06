import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreateReportService } from 'modules/reports/interfaces/services/create.report.service.interface';
import { Repository } from 'typeorm';
import { CreateReportDto } from '../dto/create.report.dto';
import { ReportEntity } from '../domain/report.entity';

@Injectable()
export class CreateReportService implements ICreateReportService {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
  ) {}

  async execute(createReportDto: CreateReportDto): Promise<ReportEntity> {
    const report = new ReportEntity();
    report.title = createReportDto.title;
    report.description = createReportDto.description;

    return this.reportRepository.save(report);
  }
}
