import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreateReportService } from 'src/reports/interfaces/services/create.report.service.interface';
import { Repository } from 'typeorm';
import { ReportDomain } from 'src/reports/domain/report.domain';
import { Report } from '../domain/report.entity';
import { CreateReportDto } from '../dto/create-report.dto';

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
