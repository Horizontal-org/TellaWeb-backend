import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreateReportService } from 'modules/report/interfaces/services/create.report.service.interface';
import { Repository } from 'typeorm';
import { CreateReportDto } from '../dto/create.report.dto';
import { ReportEntity } from '../domain/report.entity';
import { ReadUserDto } from 'modules/user/dto';

@Injectable()
export class CreateReportService implements ICreateReportService {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
  ) {}

  async execute(
    createReportDto: CreateReportDto,
    authorDto: ReadUserDto,
  ): Promise<ReportEntity> {
    const report = new ReportEntity();
    
    report.title = createReportDto.title;
    report.description = createReportDto.description;
    report.author = authorDto.toEntity();
    report.deviceInfo = createReportDto.deviceInfo;

    return this.reportRepository.save(report);
  }
}
