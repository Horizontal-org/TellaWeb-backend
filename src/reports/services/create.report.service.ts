import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreateReportService } from 'reports/interfaces/services/create.report.service.interface';
import { Repository } from 'typeorm';
import { ReportDomain } from 'reports/domain/report.domain';
import { CreateReportDto } from '../dto/create-report.dto';
import { Report } from '../domain/report.entity';

@Injectable()
export class CreateReportService implements ICreateReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async execute(createReportDto: CreateReportDto): Promise<ReportDomain> {
    return this.reportRepository.save({
      title: createReportDto.title,
      description: createReportDto.description,
    });
  }
}
