import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IDeleteByIdReportService } from '../interfaces';
import { ReportEntity } from '../domain';
import {
  IDeleteFileApplication,
  TYPES as FILE_TYPES,
} from 'modules/file/interfaces';

@Injectable()
export class deleteByIdReportService implements IDeleteByIdReportService {
  constructor(
    @InjectRepository(ReportEntity)
    private reportRepository: Repository<ReportEntity>,
    @Inject(FILE_TYPES.applications.IDeleteFileApplication)
    private deleteFileApplication: IDeleteFileApplication,
  ) {}

  async execute(reportId: string): Promise<boolean> {
    const report = await this.reportRepository.findOne(reportId);

    if (report.files && report.files.length === 0) {
      await Promise.all(
        report.files.map((file) => this.deleteFileApplication.execute(file.id)),
      );
    }

    return (await this.reportRepository.delete({ id: reportId })).affected > 0;
  }
}
