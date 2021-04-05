import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreateReportService } from 'reports/interfaces/services/create.report.service.interface';
import { Repository } from 'typeorm';
import { CreateReportDto } from '../dto/create-report.dto';
import { Report } from '../domain/report.entity';

@Injectable()
export class CreateReportService implements ICreateReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}

  async execute(createReportDto: CreateReportDto): Promise<Report> {
    const report = new Report();
    report.title = createReportDto.title;
    report.description = createReportDto.description;
    report.author = createReportDto.author;

    return this.reportRepository.save(report);
  }
}
