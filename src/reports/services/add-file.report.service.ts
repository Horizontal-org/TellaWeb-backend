import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IGetByIdFileApplication } from 'files/interfaces/applications/get-by-id.file.application.inteface';
import { TYPES as TYPES_FILES } from 'files/interfaces/types';
import { IAddFileReportService } from 'reports/interfaces/services/add-file.report.service.interface';
import { Repository } from 'typeorm';
import { ReportFile } from 'reports/domain/report-files.entity';
import { Report } from 'reports/domain/report.entity';
import { AddFileReportDto } from 'reports/dto/add-file-reports.dto';

@Injectable()
export class AddFileReportService implements IAddFileReportService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @Inject(TYPES_FILES.applications.IGetByIdFileApplication)
    private readonly getByIdFileApplication: IGetByIdFileApplication,
  ) {}

  async execute({ fileId, reportId }: AddFileReportDto) {
    const report = await this.reportRepository.findOne(reportId);
    const file = await this.getByIdFileApplication.execute(fileId);

    const reportFile = new ReportFile();
    reportFile.file = file;
    reportFile.report = report;

    report.files.push(reportFile);
    this.reportRepository.save(report);
    return report;
  }
}
