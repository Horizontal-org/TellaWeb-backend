import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICreateReportService } from 'modules/report/interfaces/services/create.report.service.interface';
import { Repository } from 'typeorm';
import { CreateReportDto } from '../dto/create.report.dto';
import { ReportEntity } from '../domain/report.entity';
import { ReadUserDto } from 'modules/user/dto';
import { ProjectEntity } from 'modules/project/domain';

@Injectable()
export class CreateReportService implements ICreateReportService {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
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

    if (createReportDto.projectId) {
      const project = await this.projectRepository.findOne(createReportDto.projectId)
      report.project = project
    }


    return this.reportRepository.save(report);
  }
}
