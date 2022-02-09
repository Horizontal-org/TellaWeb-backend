import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IEditReportService } from 'modules/report/interfaces/services/edit.report.service.interface';
import { Repository } from 'typeorm';
import { EditReportDto } from '../dto/edit.report.dto';
import { ReportEntity } from '../domain/report.entity';

@Injectable()
export class EditReportService implements IEditReportService {
  constructor(
    @InjectRepository(ReportEntity)
    private readonly reportRepository: Repository<ReportEntity>,
  ) {}

  async execute(editReportDto: EditReportDto): Promise<ReportEntity> {
    const report = await this.reportRepository.findOne(editReportDto.id);

    report.update(editReportDto);
    const updatedReport = await this.reportRepository.save(report);

    return updatedReport;
  }
}
